import { horizonServer } from './client'

export interface HorizonClaimableBalance {
  id: string
  asset: string
  amount: string
  sponsor: string
  claimants: Array<{
    destination: string
    predicate: Record<string, unknown>
  }>
  last_modified_ledger: number
  last_modified_time: string
}

interface HorizonOperationEffect {
  type: string
  balance_id?: string
}

interface HorizonOperationRecord {
  type: string
  effects?: () => Promise<{ records: HorizonOperationEffect[] }>
  _links?: {
    effects?: {
      href?: string
    }
  }
}

async function getOperationEffects(operation: HorizonOperationRecord) {
  if (typeof operation.effects === 'function') {
    const response = await operation.effects()
    return response.records
  }

  const effectsHref = operation._links?.effects?.href
  if (!effectsHref) return []

  const response = await fetch(effectsHref)
  if (!response.ok) return []

  const data = (await response.json()) as { _embedded?: { records?: HorizonOperationEffect[] } }
  return data._embedded?.records ?? []
}

/**
 * Resolve the real Claimable Balance ID from a transaction hash.
 *
 * Horizon exposes the operation ID and the claimable balance ID separately.
 * The balance ID is emitted as an effect of the create_claimable_balance operation,
 * so we must inspect operation effects instead of reusing the operation record ID.
 */
export async function getClaimableBalanceIdFromTransaction(
  txHash: string
): Promise<string | null> {
  try {
    const txRecord = await horizonServer.transactions().transaction(txHash).call()
    const opsPage = await (txRecord as { operations: () => Promise<{ records: HorizonOperationRecord[] }> }).operations()

    const createOperation = opsPage.records.find((operation) => operation.type === 'create_claimable_balance')
    if (!createOperation) return null

    const effects = await getOperationEffects(createOperation)
    const createdEffect = effects.find((effect) => effect.type === 'claimable_balance_created')

    return createdEffect?.balance_id ?? null
  } catch {
    return null
  }
}

/**
 * Fetch all claimable balances where the given address is a claimant.
 * Used by the worker to see what they can claim.
 */
export async function getClaimableBalancesForClaimant(
  claimantAddress: string
): Promise<HorizonClaimableBalance[]> {
  const result = await horizonServer
    .claimableBalances()
    .claimant(claimantAddress)
    .limit(50)
    .order('desc')
    .call()

  return result.records as unknown as HorizonClaimableBalance[]
}

/**
 * Fetch all claimable balances sponsored by a given employer address.
 * Used by the employer to see active locked payments.
 */
export async function getClaimableBalancesBySponsor(
  sponsorAddress: string
): Promise<HorizonClaimableBalance[]> {
  const result = await horizonServer
    .claimableBalances()
    .sponsor(sponsorAddress)
    .limit(50)
    .order('desc')
    .call()

  return result.records as unknown as HorizonClaimableBalance[]
}

/**
 * Fetch a single claimable balance by ID.
 * Returns null if not found (i.e. already claimed or never existed).
 */
export async function getClaimableBalanceById(
  balanceId: string
): Promise<HorizonClaimableBalance | null> {
  try {
    const result = await horizonServer
      .claimableBalances()
      .claimableBalance(balanceId)
      .call()

    return result as unknown as HorizonClaimableBalance
  } catch {
    // 404 means it was claimed or doesn't exist
    return null
  }
}

/**
 * Check if a claimable balance still exists (i.e. payment is still locked).
 */
export async function isBalanceStillClaimable(balanceId: string): Promise<boolean> {
  const balance = await getClaimableBalanceById(balanceId)
  return balance !== null
}
