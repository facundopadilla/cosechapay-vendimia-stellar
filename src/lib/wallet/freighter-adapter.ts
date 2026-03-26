import {
  isConnected as freighterIsConnected,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api'
import { TransactionBuilder } from '@stellar/stellar-sdk'
import { horizonServer, STELLAR_NETWORK } from '@/lib/stellar/client'

export interface WalletAdapter {
  isConnected(): Promise<boolean>
  getPublicKey(): Promise<string>
  signXdr(xdr: string): Promise<string>
  signAndSubmitXdr(xdr: string): Promise<{ hash: string }>
}

type FreighterErrorLike =
  | string
  | {
      message?: string
    }
  | undefined

function getErrorMessage(error: FreighterErrorLike, fallback: string) {
  if (typeof error === 'string' && error.trim()) return error
  if (error && typeof error === 'object' && error.message) return error.message
  return fallback
}

async function submitSignedXdr(signedXdr: string): Promise<{ hash: string }> {
  const tx = TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK)
  const result = await horizonServer.submitTransaction(tx)
  return { hash: result.hash }
}

export const freighterAdapter: WalletAdapter = {
  async isConnected(): Promise<boolean> {
    const result = await freighterIsConnected()
    return Boolean(result.isConnected)
  },

  async getPublicKey(): Promise<string> {
    const result = await requestAccess()

    if (result.error) {
      throw new Error(
        getErrorMessage(
          result.error,
          'No se pudo acceder a Freighter. Verificá la extensión y autorizá este sitio.'
        )
      )
    }

    if (!result.address) {
      throw new Error('Freighter no devolvió una dirección pública válida.')
    }

    return result.address
  },

  async signAndSubmitXdr(xdr: string): Promise<{ hash: string }> {
    const signedTxXdr = await this.signXdr(xdr)
    return submitSignedXdr(signedTxXdr)
  },

  async signXdr(xdr: string): Promise<string> {
    const address = await this.getPublicKey()

    const result = await signTransaction(xdr, {
      networkPassphrase: STELLAR_NETWORK,
      address,
    })

    if (result.error) {
      throw new Error(
        getErrorMessage(result.error, 'Freighter no pudo firmar la transacción.')
      )
    }

    if (!result.signedTxXdr) {
      throw new Error('Freighter no devolvió la transacción firmada.')
    }

    return result.signedTxXdr
  },
}
