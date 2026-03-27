import { useNavigate } from 'react-router-dom'
import type { WalletState, CreatePaymentInput, PaymentRecord } from '@/types/payment'
import { getPaymentById } from '@/lib/storage/payment-drafts'
import { PaymentForm } from '@/components/payments/payment-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { txExplorerUrl } from '@/lib/stellar/client'
import { isSorobanCompanionEnabled } from '@/lib/soroban/client'
import './create-payment-page.css'

interface CreatePaymentPageProps {
  wallet: WalletState
  onCreatePayment: (input: CreatePaymentInput) => Promise<PaymentRecord>
  onRegisterSoroban: (paymentId: string) => Promise<void>
  onSkipSoroban: (paymentId: string) => Promise<void>
}

export function CreatePaymentPage({
  wallet,
  onCreatePayment,
  onRegisterSoroban,
  onSkipSoroban,
}: CreatePaymentPageProps) {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdPayment, setCreatedPayment] = useState<PaymentRecord | null>(null)
  const [registeringSoroban, setRegisteringSoroban] = useState(false)
  const sorobanEnabled = isSorobanCompanionEnabled()

  function reloadCreatedPayment(paymentId: string) {
    const next = getPaymentById(paymentId)
    if (next) setCreatedPayment(next)
  }

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

  async function handleRegisterSoroban() {
    if (!createdPayment) return
    setRegisteringSoroban(true)
    try {
      await onRegisterSoroban(createdPayment.id)
    } finally {
      reloadCreatedPayment(createdPayment.id)
      setRegisteringSoroban(false)
    }
  }

  async function handleSkipSoroban() {
    if (!createdPayment) return
    await onSkipSoroban(createdPayment.id)
    reloadCreatedPayment(createdPayment.id)
  }

  if (success && createdPayment) {
    const canOfferSorobanStep =
      sorobanEnabled &&
      createdPayment.status === 'locked' &&
      (createdPayment.sorobanRegistrationStatus === 'pending' ||
        createdPayment.sorobanRegistrationStatus === 'skipped' ||
        createdPayment.sorobanRegistrationStatus === 'failed')

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

        {canOfferSorobanStep && (
          <div className="create-page__soroban-step">
            <strong>Paso 2 opcional: registrar el acuerdo en Soroban</strong>
            <p>
              El escrow principal ya quedó creado. Ahora podés pagar una segunda firma para registrar el hash del acuerdo en Soroban, o saltearlo por ahora.
            </p>

            <div className="create-page__soroban-actions">
              <Button variant="primary" onClick={handleRegisterSoroban} loading={registeringSoroban}>
                {registeringSoroban ? 'Revisá Freighter…' : 'Pagar Soroban ahora'}
              </Button>
              <Button variant="ghost" onClick={handleSkipSoroban} disabled={registeringSoroban}>
                No pagar Soroban por ahora
              </Button>
            </div>
          </div>
        )}

        {createdPayment.sorobanRegistrationStatus === 'registered' && (
          <div className="create-page__soroban-feedback create-page__soroban-feedback--success">
            ✅ Registro Soroban confirmado. Ya podés mostrar también la TX compañera en el detalle del pago.
          </div>
        )}

        {createdPayment.sorobanRegistrationStatus === 'submitted' && (
          <div className="create-page__soroban-feedback create-page__soroban-feedback--warning">
            ⏳ La transacción Soroban fue enviada. Revisá el detalle del pago para ver su confirmación final.
          </div>
        )}

        {createdPayment.sorobanRegistrationStatus === 'failed' && createdPayment.sorobanError && (
          <div className="create-page__soroban-feedback create-page__soroban-feedback--error">
            {createdPayment.sorobanError}
          </div>
        )}

        {createdPayment.sorobanRegistrationStatus === 'skipped' && (
          <div className="create-page__soroban-feedback create-page__soroban-feedback--neutral">
            Soroban quedó omitido por ahora. El escrow principal sigue activo y podés registrarlo más tarde desde el detalle.
          </div>
        )}

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

        {sorobanEnabled && (
          <div className="create-page__note create-page__note--warning">
            <strong>Freighter te va a pedir dos firmas</strong>
            <ul>
              <li>Primero firma la creación del escrow con Claimable Balances.</li>
              <li>Después vuelve a abrirse para registrar el acuerdo en Soroban.</li>
              <li>La segunda firma es normal y forma parte de la companion layer.</li>
            </ul>
          </div>
        )}

        <PaymentForm
          onSubmit={handleSubmit}
          submitting={submitting}
          sorobanEnabled={sorobanEnabled}
        />
      </div>
    </div>
  )
}
