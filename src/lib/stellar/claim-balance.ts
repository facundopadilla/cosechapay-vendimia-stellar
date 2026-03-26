import { TransactionBuilder, Operation, BASE_FEE } from '@stellar/stellar-sdk'
import { horizonServer, STELLAR_NETWORK } from './client'

interface ClaimBalanceParams {
  claimantPublicKey: string
  claimableBalanceId: string
  signAndSubmit: (xdr: string) => Promise<{ hash: string }>
}

/**
 * Build and submit a claimClaimableBalance operation.
 * The claimant (worker) calls this to receive the locked funds.
 */
export async function claimBalance({
  claimantPublicKey,
  claimableBalanceId,
  signAndSubmit,
}: ClaimBalanceParams): Promise<{ txHash: string }> {
  let account

  try {
    account = await horizonServer.loadAccount(claimantPublicKey)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (message.includes('Not Found')) {
      throw new Error(
        'La wallet del cosechero no existe en Stellar Testnet todavía. Fondeala primero con Friendbot antes de reclamar.'
      )
    }

    throw error
  }

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: STELLAR_NETWORK,
  })
    .addOperation(
      Operation.claimClaimableBalance({
        balanceId: claimableBalanceId,
      })
    )
    .setTimeout(180)
    .build()

  const xdr = tx.toXDR()

  let hash: string

  try {
    const response = await signAndSubmit(xdr)
    hash = response.hash
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (
      message.includes('op_cannot_claim') ||
      message.includes('cannot claim') ||
      message.includes('claimable balance')
    ) {
      throw new Error(
        'Este pago todavía sigue bloqueado por tiempo. Esperá a que se cumpla la ventana de desbloqueo y probá de nuevo.'
      )
    }

    throw error
  }

  return { txHash: hash }
}
