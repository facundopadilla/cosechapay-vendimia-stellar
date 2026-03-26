import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { PaymentRecord, WalletState } from '@/types/payment'
import { getPaymentById } from '@/lib/storage/payment-drafts'
import { PaymentStatusBadge } from '@/components/payments/payment-status-badge'
import { Button } from '@/components/ui/button'
import { balanceExplorerUrl, txExplorerUrl, accountExplorerUrl } from '@/lib/stellar/client'
import {
  calculateReleaseAt,
  formatReleaseDelay,
  isReleaseWindowOpen,
} from '@/lib/stellar/time-lock'
import './payment-detail-page.css'

interface PaymentDetailPageProps {
  wallet: WalletState
  onClaim: (paymentId: string) => Promise<void>
  onSync: (paymentId: string) => Promise<void>
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 10)}…${addr.slice(-8)}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getSorobanStatusCopy(payment: PaymentRecord) {
  switch (payment.sorobanRegistrationStatus) {
    case 'registered':
      return 'Registrado en Soroban como capa compañera del acuerdo.'
    case 'submitted':
      return 'La transacción Soroban fue enviada y quedó pendiente de confirmación.'
    case 'pending':
      return 'Registrando acuerdo en Soroban…'
    case 'failed':
      return 'El registro Soroban falló, pero el escrow principal sigue activo.'
    case 'disabled':
      return 'La capa compañera Soroban no está configurada en este entorno.'
    default:
      return null
  }
}

export function PaymentDetailPage({ wallet, onClaim, onSync }: PaymentDetailPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [payment, setPayment] = useState<PaymentRecord | null>(null)
  const [claiming, setClaiming] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const autoSyncedIdRef = useRef<string | null>(null)

  function loadPayment() {
    if (id) {
      const p = getPaymentById(id)
      setPayment(p)
    }
  }

  useEffect(() => {
    autoSyncedIdRef.current = null
    loadPayment()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!id) return
    if (!payment) return
    if (autoSyncedIdRef.current === payment.id) return

    const needsSync = payment.status === 'locked' || (!payment.claimableBalanceId && !!payment.txHash)
    if (!needsSync) return

    autoSyncedIdRef.current = payment.id

    onSync(id)
      .then(() => loadPayment())
      .catch(() => {
        // Non-fatal for MVP: user can retry manually.
      })
  }, [id, payment, onSync]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSync() {
    if (!id) return
    setSyncing(true)
    try {
      await onSync(id)
      loadPayment()
    } finally {
      setSyncing(false)
    }
  }

  async function handleClaim() {
    if (!id) return
    setClaiming(true)
    setClaimError(null)
    try {
      await onClaim(id)
      loadPayment()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al reclamar el balance'
      setClaimError(msg)
    } finally {
      setClaiming(false)
    }
  }

  if (!payment) {
    return (
      <div className="detail-page__not-found">
        <p>Pago no encontrado.</p>
        <Button variant="ghost" onClick={() => navigate('/')}>← Volver</Button>
      </div>
    )
  }

  const canClaim =
    wallet.isConnected &&
    wallet.publicKey === payment.claimantAddress &&
    payment.status === 'locked' &&
    isReleaseWindowOpen(payment.createdAt, payment.releaseDelaySeconds)

  const isLocked = payment.status === 'locked'
  const releaseAt = calculateReleaseAt(payment.createdAt, payment.releaseDelaySeconds)
  const sorobanStatusCopy = getSorobanStatusCopy(payment)

  return (
    <div className="detail-page">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
        ← Volver a pagos
      </Button>

      {/* Header */}
      <div className="detail-page__header">
        <div>
          <div className="detail-page__amount">
            {payment.amount} <span className="detail-page__asset">{payment.asset}</span>
          </div>
          {payment.description && (
            <p className="detail-page__desc">{payment.description}</p>
          )}
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      {/* Details grid */}
      <div className="detail-page__card">
        <div className="detail-page__grid">
          <div className="detail-page__field">
            <span className="detail-page__label">Empleador</span>
            <a
              href={accountExplorerUrl(payment.employerAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-page__value mono"
            >
              {truncateAddress(payment.employerAddress)} ↗
            </a>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Cosechero</span>
            <a
              href={accountExplorerUrl(payment.claimantAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-page__value mono"
            >
              {truncateAddress(payment.claimantAddress)} ↗
            </a>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Asset</span>
            <span className="detail-page__value">{payment.asset}</span>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Se desbloquea en</span>
            <span className="detail-page__value">{formatReleaseDelay(payment.releaseDelaySeconds)}</span>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Reclamable desde</span>
            <span className="detail-page__value">{formatDate(releaseAt.toISOString())}</span>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Creado</span>
            <span className="detail-page__value">{formatDate(payment.createdAt)}</span>
          </div>

          <div className="detail-page__field">
            <span className="detail-page__label">Estado</span>
            <span className="detail-page__value">
              <PaymentStatusBadge status={payment.status} />
            </span>
          </div>

          {payment.txHash && (
            <div className="detail-page__field">
              <span className="detail-page__label">TX Creación</span>
              <a
                href={txExplorerUrl(payment.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-page__value mono"
              >
                {payment.txHash.slice(0, 16)}… ↗
              </a>
            </div>
          )}

          {payment.claimableBalanceId && (
            <div className="detail-page__field detail-page__field--wide">
              <span className="detail-page__label">Claimable Balance ID</span>
              <a
                href={balanceExplorerUrl(payment.claimableBalanceId)}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-page__value mono detail-page__balance-id"
              >
                {payment.claimableBalanceId} ↗
              </a>
            </div>
          )}

          {payment.claimTxHash && (
            <div className="detail-page__field">
              <span className="detail-page__label">TX Reclamo</span>
              <a
                href={txExplorerUrl(payment.claimTxHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-page__value mono"
              >
                {payment.claimTxHash.slice(0, 16)}… ↗
              </a>
            </div>
          )}

          {payment.sorobanRegistrationStatus && (
            <div className="detail-page__field detail-page__field--wide">
              <span className="detail-page__label">Registro Soroban</span>
              <div className="detail-page__value detail-page__soroban-block">
                {sorobanStatusCopy && (
                  <span
                    className={`detail-page__soroban-status detail-page__soroban-status--${payment.sorobanRegistrationStatus}`}
                  >
                    {sorobanStatusCopy}
                  </span>
                )}

                {payment.sorobanTxHash && (
                  <a
                    href={txExplorerUrl(payment.sorobanTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono"
                  >
                    TX Soroban: {payment.sorobanTxHash.slice(0, 16)}… ↗
                  </a>
                )}

                {payment.sorobanAgreementHash && (
                  <span className="mono detail-page__soroban-hash">
                    Hash acuerdo: {payment.sorobanAgreementHash}
                  </span>
                )}

                {payment.sorobanError && (
                  <span className="detail-page__soroban-error">{payment.sorobanError}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="detail-page__actions">
        {isLocked && (
          <Button variant="ghost" size="sm" onClick={handleSync} loading={syncing}>
            {syncing ? 'Sincronizando…' : 'Verificar estado on-chain'}
          </Button>
        )}

        {canClaim && (
          <Button variant="primary" onClick={handleClaim} loading={claiming}>
            {claiming ? 'Reclamando fondos…' : 'Reclamar fondos'}
          </Button>
        )}

        {!wallet.isConnected && payment.status === 'locked' && (
          <p className="detail-page__hint">
            Conectá la wallet del cosechero para poder reclamar.
          </p>
        )}

        {wallet.isConnected &&
          wallet.publicKey !== payment.claimantAddress &&
          payment.status === 'locked' && (
           <p className="detail-page__hint">
              Solo la wallet del cosechero puede reclamar este balance.
            </p>
          )}

        {wallet.isConnected && wallet.publicKey === payment.claimantAddress && payment.status === 'locked' && (
          <p className={`detail-page__hint ${canClaim ? 'detail-page__hint--success' : ''}`}>
            {canClaim
              ? 'Esta wallet coincide con el cosechero. Ya podés reclamar los fondos.'
              : `Esta wallet coincide con el cosechero, pero el lock sigue activo hasta ${formatDate(
                  releaseAt.toISOString()
                )}.`}
          </p>
        )}
      </div>

      {claimError && (
        <div className="detail-page__error" role="alert">
          {claimError}
        </div>
      )}

      {payment.status === 'claimed' && (
        <div className="detail-page__claimed-banner">
          ✓ Este pago fue reclamado. Los fondos fueron transferidos al cosechero.
        </div>
      )}

      {/* Explorer link */}
      {payment.claimableBalanceId && (
        <div className="detail-page__explorer-note">
          <a
            href={balanceExplorerUrl(payment.claimableBalanceId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver en Stellar Expert →
          </a>
        </div>
      )}
    </div>
  )
}
