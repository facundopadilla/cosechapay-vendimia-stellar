import { Link } from 'react-router-dom'
import type { PaymentRecord } from '@/types/payment'
import { PaymentStatusBadge } from './payment-status-badge'
import { txExplorerUrl } from '@/lib/stellar/client'
import './payment-card.css'

interface PaymentCardProps {
  payment: PaymentRecord
}

function truncateAddress(addr: string): string {
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-6)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <Link to={`/payments/${payment.id}`} className="payment-card" aria-label={`Ver pago ${payment.id}`}>
      <div className="payment-card__header">
        <div className="payment-card__amount">
          {payment.amount} <span className="payment-card__asset">{payment.asset}</span>
        </div>
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="payment-card__meta">
        <div className="payment-card__field">
          <span className="payment-card__label">Cosechero</span>
          <span className="payment-card__value mono">
            {truncateAddress(payment.claimantAddress)}
          </span>
        </div>
        <div className="payment-card__field">
          <span className="payment-card__label">Creado</span>
          <span className="payment-card__value">{formatDate(payment.createdAt)}</span>
        </div>
      </div>

      {payment.description && (
        <p className="payment-card__desc">{payment.description}</p>
      )}

      {payment.txHash && (
        <div className="payment-card__links">
          <button
            type="button"
            className="payment-card__link"
            onClick={() => window.open(txExplorerUrl(payment.txHash!), '_blank', 'noopener,noreferrer')}
          >
            Ver tx ↗
          </button>
        </div>
      )}
    </Link>
  )
}
