import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { WalletState } from '@/types/payment'
import { ConnectWalletButton } from '@/components/wallet/connect-wallet-button'
import './app-layout.css'

interface AppLayoutProps {
  wallet: WalletState
  onConnect: () => void
  onDisconnect: () => void
  children: ReactNode
}

export function AppLayout({ wallet, onConnect, onDisconnect, children }: AppLayoutProps) {
  const location = useLocation()

  function isExactActive(path: string) {
    return location.pathname === path
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <Link to="/" className="app-header__logo">
              🌿 CosechaPay
            </Link>
            <span className="app-header__network">Testnet</span>
          </div>

          <nav className="app-nav">
            {wallet.isConnected && (
              <>
                <Link
                  to="/payments"
                  className={`app-nav__link ${isExactActive('/payments') ? 'app-nav__link--active' : ''}`}
                >
                  Mis pagos activos
                </Link>
                <Link
                  to="/payments/new"
                  className={`app-nav__link ${isExactActive('/payments/new') ? 'app-nav__link--active' : ''}`}
                >
                  Crear pago
                </Link>
                <Link
                  to="/claimables"
                  className={`app-nav__link ${isExactActive('/claimables') ? 'app-nav__link--active' : ''}`}
                >
                  Reclamar pago
                </Link>
              </>
            )}
          </nav>

          <div className="app-header__actions">
            <ConnectWalletButton
              wallet={wallet}
              onConnect={onConnect}
              onDisconnect={onDisconnect}
            />
          </div>
        </div>
      </header>

      {(wallet.isConnecting || wallet.error) && (
        <div className="app-layout__wallet-status-wrap">
          <div className={`app-layout__wallet-status ${wallet.error ? 'app-layout__wallet-status--error' : ''}`} role={wallet.error ? 'alert' : 'status'}>
            {wallet.error ?? 'Esperando autorización de Freighter…'}
          </div>
        </div>
      )}

      <main className="app-main">
        {children}
      </main>

      <footer className="app-footer">
        <span>CosechaPay · Stellar Testnet · Hackathon MVP</span>
      </footer>
    </div>
  )
}
