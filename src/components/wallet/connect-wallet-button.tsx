import type { WalletState } from '@/types/payment'
import { Button } from '@/components/ui/button'
import './connect-wallet-button.css'

interface ConnectWalletButtonProps {
  wallet: WalletState
  onConnect: () => void
  onDisconnect: () => void
}

function truncateKey(key: string): string {
  return `${key.slice(0, 6)}…${key.slice(-4)}`
}

export function ConnectWalletButton({ wallet, onConnect, onDisconnect }: ConnectWalletButtonProps) {
  function handleConnect() {
    void onConnect()
  }

  function handleDisconnect() {
    void onDisconnect()
  }

  if (wallet.isConnected && wallet.publicKey) {
    return (
      <div className="wallet-info">
        <span className="wallet-info__key mono" title={wallet.publicKey}>
          {truncateKey(wallet.publicKey)}
        </span>
        <Button variant="ghost" size="sm" onClick={handleDisconnect}>
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={wallet.isConnecting}
      onClick={handleConnect}
      aria-busy={wallet.isConnecting}
    >
      {wallet.isConnecting ? 'Conectando…' : 'Conectar Freighter'}
    </Button>
  )
}
