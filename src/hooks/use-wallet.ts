import { useState, useCallback } from 'react'
import type { WalletState } from '@/types/payment'
import { freighterAdapter } from '@/lib/wallet/freighter-adapter'

const initialState: WalletState = {
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  error: null,
}

/**
 * useWallet — manages the Freighter wallet connection state.
 *
 * Usage:
 *   const { wallet, connect, disconnect } = useWallet()
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState)

  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }))
    try {
      const publicKey = await freighterAdapter.getPublicKey()
      setWallet({
        publicKey,
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error desconocido al conectar la wallet'
      setWallet({
        publicKey: null,
        isConnected: false,
        isConnecting: false,
        error: message,
      })
    }
  }, [])

  const disconnect = useCallback(() => {
    setWallet(initialState)
  }, [])

  return { wallet, connect, disconnect }
}
