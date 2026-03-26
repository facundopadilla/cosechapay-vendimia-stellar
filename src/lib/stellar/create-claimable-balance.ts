import {
  TransactionBuilder,
  Operation,
  Claimant,
  BASE_FEE,
  Asset,
} from '@stellar/stellar-sdk'
import { horizonServer, STELLAR_NETWORK } from './client'
import { getClaimableBalanceIdFromTransaction } from './query-payments'
import { EMPLOYER_RECLAIM_DELAY_SECONDS } from './time-lock'

interface CreateClaimableBalanceParams {
  employerPublicKey: string
  claimantPublicKey: string
  amount: string
  releaseDelaySeconds: number
  /** Sign and submit the XDR — provided by the wallet adapter */
  signAndSubmit: (xdr: string) => Promise<{ hash: string }>
}

interface CreateClaimableBalanceResult {
  txHash: string
  /** The Claimable Balance ID — derived from the transaction and operation index */
  claimableBalanceId: string | null
}

/**
 * Build and submit a createClaimableBalance operation using XLM (native asset).
 * The claimant can claim only after the configured time lock delay.
 * The employer keeps a secondary claimant predicate as a safety reclaim hatch (30 days).
 */
export async function createClaimableBalance({
  employerPublicKey,
  claimantPublicKey,
  amount,
  releaseDelaySeconds,
  signAndSubmit,
}: CreateClaimableBalanceParams): Promise<CreateClaimableBalanceResult> {
  const account = await horizonServer.loadAccount(employerPublicKey)

  // Primary claimant: the worker — can claim only after the configured delay.
  const workerClaimant = new Claimant(
    claimantPublicKey,
    Claimant.predicateNot(Claimant.predicateBeforeRelativeTime(String(releaseDelaySeconds)))
  )

  // Secondary claimant: the employer — can reclaim after 30 days as a safety hatch.
  const employerClaimant = new Claimant(
    employerPublicKey,
    Claimant.predicateNot(
      Claimant.predicateBeforeRelativeTime(String(EMPLOYER_RECLAIM_DELAY_SECONDS))
    )
  )

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.createClaimableBalance({
        asset: Asset.native(),
        amount,
        claimants: [workerClaimant, employerClaimant],
      })
    )
    .setTimeout(180)
    .build()

  const xdr = tx.toXDR()
  const { hash } = await signAndSubmit(xdr)

  // Derive the Claimable Balance ID from Horizon effects.
  // IMPORTANT: the operation record ID is NOT the claimable balance ID.
  const claimableBalanceId = await getClaimableBalanceIdFromTransaction(hash)

  return { txHash: hash, claimableBalanceId }
}
