import { Horizon, Networks } from '@stellar/stellar-sdk'

// CosechaPay uses Stellar Testnet exclusively for the MVP
export const STELLAR_NETWORK = Networks.TESTNET
export const HORIZON_URL = 'https://horizon-testnet.stellar.org'
export const STELLAR_EXPLORER_BASE = 'https://stellar.expert/explorer/testnet'
const CLAIMABLE_BALANCE_HEX_PATTERN = /^[0-9a-f]{72}$/i

/** Horizon server instance — use this for all on-chain reads */
export const horizonServer = new Horizon.Server(HORIZON_URL)

/** Convenience: build a Stellar Expert link for a transaction hash */
export function txExplorerUrl(txHash: string): string {
  return `${STELLAR_EXPLORER_BASE}/tx/${txHash}`
}

/** Convenience: build a Stellar Expert link for a claimable balance */
export function balanceExplorerUrl(balanceId: string): string {
  return `${HORIZON_URL}/claimable_balances/${balanceId}`
}

export function isExplorerCompatibleClaimableBalanceId(balanceId: string): boolean {
  return CLAIMABLE_BALANCE_HEX_PATTERN.test(balanceId.trim())
}

/** Convenience: build a Stellar Expert link for an account */
export function accountExplorerUrl(address: string): string {
  return `${STELLAR_EXPLORER_BASE}/account/${address}`
}
