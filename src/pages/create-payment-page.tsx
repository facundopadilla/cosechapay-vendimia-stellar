import { useNavigate } from 'react-router-dom'
import type { WalletState, CreatePaymentInput, PaymentRecord } from '@/types/payment'
import { PaymentForm } from '@/components/payments/payment-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { txExplorerUrl } from '@/lib/stellar/client'
import './create-payment-page.css'

interface CreatePaymentPageProps {
  wallet: WalletState
  onCreatePayment: (input: CreatePaymentInput) => Promise<PaymentRecord>
}

export function CreatePaymentPage({ wallet, onCreatePayment }: CreatePaymentPageProps) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdPayment, setCreatedPayment] = useState<PaymentRecord | null>(null)

  if (!wallet.isConnected) {
    return (
      <div className="create-page__gate">
        <h2>Wallet no conectada</h2>
        <p>Conectá Freighter para poder crear un pago.</p>
      </div>
    )
  }

  async function handleSubmit(input: CreatePaymentInput) {
    setSubmitting(true)
    try {
      const payment = await onCreatePayment(input)
      setCreatedPayment(payment)
      setSuccess(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (success && createdPayment) {
    return (
      <div className="create-page__success">
        <div className="create-page__success-icon">✓</div>
        <h2>¡Fondos bloqueados!</h2>
        <p>
          El pago de {createdPayment.amount} XLM fue creado y los fondos están bloqueados on-chain.
        </p>
        <div className="create-page__success-meta">
          {createdPayment.txHash && (
            <a href={txExplorerUrl(createdPayment.txHash)} target="_blank" rel="noopener noreferrer">
              Ver transacción ↗
            </a>
          )}
        </div>
        <div className="create-page__success-actions">
          <Button variant="primary" onClick={() => navigate(`/payments/${createdPayment.id}`)}>
            Ver detalle del pago
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="create-page">
      <div className="create-page__header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          ← Volver
        </Button>
        <h1 className="create-page__title">Nuevo pago de cosecha</h1>
        <p className="create-page__subtitle">
          Los fondos quedarán bloqueados en Stellar Testnet como Claimable Balance.
          El cosechero podrá reclamarlos cuando terminen el trabajo.
        </p>
      </div>

      <div className="create-page__form-card">
        <div className="create-page__note">
          <strong>Antes de crear el pago</strong>
          <ul>
            <li>Confirmá que tu wallet esté en Stellar Testnet.</li>
            <li>La cuenta del cosechero también tiene que existir en Testnet.</li>
            <li>XLM no requiere trustline — es el asset nativo de Stellar.</li>
            <li>Elegí una ventana de desbloqueo corta para demo, por ejemplo 1 minuto.</li>
            <li>Para la demo, usá una descripción corta y un monto chico.</li>
          </ul>
        </div>
        <PaymentForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  )
}
