// Domain types for CosechaPay

export type PaymentStatus =
  | 'draft'
  | 'submitting'
  | 'locked'
  | 'claiming'
  | 'claimed'
  | 'failed'

export type SorobanRegistrationStatus =
  | 'disabled'
  | 'pending'
  | 'skipped'
  | 'submitted'
  | 'registered'
  | 'failed'

/** Only XLM is supported in the MVP */
export type PaymentAsset = 'XLM'

export interface PaymentRecord {
  /** Local UUID generated at creation time */
  id: string
  /** Stellar public key of the claimant (worker / cosechero) */
  claimantAddress: string
  /** Stellar public key of the employer who created the payment */
  employerAddress: string
  /** Amount as a decimal string, e.g. "100.0000000" */
  amount: string
  asset: PaymentAsset
  description?: string
  /** Time lock before the worker can claim, in seconds */
  releaseDelaySeconds: number
  status: PaymentStatus
  /** Claimable Balance ID returned by Horizon after creation */
  claimableBalanceId?: string
  /** ISO timestamp of local creation */
  createdAt: string
  /** Transaction hash of the create operation */
  txHash?: string
  /** Transaction hash of the claim operation */
  claimTxHash?: string
  /** Best-effort Soroban companion registration state */
  sorobanRegistrationStatus?: SorobanRegistrationStatus
  /** Soroban contract invocation transaction hash */
  sorobanTxHash?: string
  /** Deterministic agreement hash registered in Soroban */
  sorobanAgreementHash?: string
  /** Non-blocking companion-layer error for UI visibility */
  sorobanError?: string
}

export interface CreatePaymentInput {
  claimantAddress: string
  amount: string
  asset: PaymentAsset
  releaseDelaySeconds: number
  description?: string
}

export interface WalletState {
  publicKey: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}
