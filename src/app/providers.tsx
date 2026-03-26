import { useWallet } from '@/hooks/use-wallet'
import { usePayments } from '@/hooks/use-payments'
import { freighterAdapter } from '@/lib/wallet/freighter-adapter'
import { AppLayout } from '@/components/layout/app-layout'
import { RouterProvider } from './router'

/**
 * Providers — wraps the app with shared state (wallet + payments).
 * We use simple prop-drilling for this MVP scope instead of Context to keep it explicit.
 */
export function Providers() {
  const { wallet, connect, disconnect } = useWallet()
  const paymentsState = usePayments(
    wallet.isConnected ? freighterAdapter : null,
    wallet.publicKey
  )

  return (
    <AppLayout wallet={wallet} onConnect={connect} onDisconnect={disconnect}>
      <RouterProvider wallet={wallet} payments={paymentsState} />
    </AppLayout>
  )
}
