import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { HorizonClaimableBalance } from '@/lib/stellar/query-payments'
import { accountExplorerUrl, txExplorerUrl } from '@/lib/stellar/client'
import { Button } from '@/components/ui/button'
import { getAssetDisplayLabel } from '@/lib/stellar/assets'
import type { PaymentRecord } from '@/types/payment'
import { calculateReleaseAt, isReleaseWindowOpen } from '@/lib/stellar/time-lock'
import './claimable-balance-card.css'

interface ClaimableBalanceCardProps {
  balance: HorizonClaimableBalance
  onClaim: (balanceId: string) => Promise<void>
  payment?: PaymentRecord | null
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`
}

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`
}

export function ClaimableBalanceCard({ balance, onClaim, payment }: ClaimableBalanceCardProps) {
  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  const releaseAt = useMemo(() => {
    if (!payment) return null
    return calculateReleaseAt(payment.createdAt, payment.releaseDelaySeconds)
  }, [payment])

  const canClaimNow = payment
    ? isReleaseWindowOpen(payment.createdAt, payment.releaseDelaySeconds)
    : true

  useEffect(() => {
    if (!payment || canClaimNow) return

    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [payment, canClaimNow])

  async function handleClaim() {
    if (!canClaimNow) return

    setClaiming(true)
    setError(null)

    try {
      await onClaim(balance.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo reclamar el balance.')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="claimable-balance-card">
      <div className="claimable-balance-card__header">
        <div>
          <div className="claimable-balance-card__amount">{balance.amount}</div>
          <div className="claimable-balance-card__asset">{getAssetDisplayLabel(balance.asset)}</div>
          {payment?.description && (
            <p className="claimable-balance-card__description">{payment.description}</p>
          )}
          <p className="claimable-balance-card__subtitle">
            {canClaimNow
              ? 'Fondos disponibles para esta wallet.'
              : 'Fondos bloqueados hasta que se cumpla la ventana temporal.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleClaim}
          loading={claiming}
          disabled={!canClaimNow}
        >
          {claiming ? 'Reclamando…' : canClaimNow ? 'Reclamar' : 'Bloqueado'}
        </Button>
      </div>

      <div className="claimable-balance-card__meta">
        <div>
          <span className="claimable-balance-card__label">Sponsor</span>
          <a
            href={accountExplorerUrl(balance.sponsor)}
            target="_blank"
            rel="noopener noreferrer"
            className="claimable-balance-card__value mono"
          >
            {truncateAddress(balance.sponsor)} ↗
          </a>
        </div>

        <div>
          <span className="claimable-balance-card__label">Balance ID</span>
          <span className="claimable-balance-card__value mono claimable-balance-card__value--wide">
            {balance.id}
          </span>
        </div>
      </div>

      {payment && (
        <div className="claimable-balance-card__payment-context">
          <div className="claimable-balance-card__payment-context-head">
            <strong>Pago detectado en CosechaPay</strong>
            <Link to={`/payments/${payment.id}`} className="claimable-balance-card__context-link">
              Ver detalle
            </Link>
          </div>
          <div className="claimable-balance-card__context-grid">
            <div>
              <span className="claimable-balance-card__label">Monto esperado</span>
              <span className="claimable-balance-card__value">{payment.amount} {payment.asset}</span>
            </div>
            <div>
              <span className="claimable-balance-card__label">Creado</span>
              <span className="claimable-balance-card__value">
                {new Date(payment.createdAt).toLocaleString('es-AR')}
              </span>
            </div>
            {payment.txHash && (
              <div>
                <span className="claimable-balance-card__label">TX creación</span>
                <a
                  href={txExplorerUrl(payment.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="claimable-balance-card__value mono"
                >
                  {payment.txHash.slice(0, 16)}… ↗
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {payment && releaseAt && (
        <div className="claimable-balance-card__lock-note">
          <span className="claimable-balance-card__label">Ventana de reclamo</span>
          <div className="claimable-balance-card__lock-copy">
            {canClaimNow
              ? `Disponible desde ${releaseAt.toLocaleString('es-AR')}`
              : `Se habilita en ${formatRemaining(releaseAt.getTime() - now)} · ${releaseAt.toLocaleString(
                  'es-AR'
                )}`}
          </div>
        </div>
      )}

      {error && (
        <div className="claimable-balance-card__error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
