import { useState, FormEvent } from 'react'
import type { CreatePaymentInput } from '@/types/payment'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RELEASE_DELAY_OPTIONS } from '@/lib/stellar/time-lock'
import './payment-form.css'

interface PaymentFormProps {
  onSubmit: (input: CreatePaymentInput) => Promise<void>
  submitting?: boolean
  sorobanEnabled?: boolean
}

interface FormErrors {
  claimantAddress?: string
  amount?: string
  releaseDelaySeconds?: string
}

function isValidStellarAddress(addr: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(addr.trim())
}

function isValidAmount(amount: string): boolean {
  const n = parseFloat(amount)
  return !isNaN(n) && n > 0 && n <= 999_999_999
}

export function PaymentForm({ onSubmit, submitting = false, sorobanEnabled = false }: PaymentFormProps) {
  const [claimantAddress, setClaimantAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [releaseDelaySeconds, setReleaseDelaySeconds] = useState<number>(60)
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!claimantAddress.trim()) {
      errs.claimantAddress = 'La dirección del cosechero es requerida'
    } else if (!isValidStellarAddress(claimantAddress)) {
      errs.claimantAddress = 'La dirección Stellar debe empezar con G y tener 56 caracteres'
    }
    if (!amount.trim()) {
      errs.amount = 'El monto es requerido'
    } else if (!isValidAmount(amount)) {
      errs.amount = 'El monto debe ser un número positivo'
    }

    if (!RELEASE_DELAY_OPTIONS.some((item) => item.value === releaseDelaySeconds)) {
      errs.releaseDelaySeconds = 'Seleccioná una ventana de bloqueo válida'
    }

    return errs
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitError(null)

    try {
      await onSubmit({
        claimantAddress: claimantAddress.trim(),
        amount: parseFloat(amount).toFixed(7),
        asset: 'XLM',
        releaseDelaySeconds,
        description: description.trim() || undefined,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear el pago'
      setSubmitError(msg)
    }
  }

  return (
    <form className="payment-form" onSubmit={handleSubmit} noValidate>
      <Input
        label="Dirección del cosechero"
        value={claimantAddress}
        onChange={(e) => setClaimantAddress(e.target.value)}
        error={errors.claimantAddress}
        hint="Usá una cuenta Stellar Testnet ya activada y fondeada."
        placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        className="mono"
        disabled={submitting}
        autoComplete="off"
        spellCheck={false}
      />

      <Input
        label="Monto (XLM)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
        hint="Para la demo conviene arrancar con montos chicos, por ejemplo 0.1 XLM."
        placeholder="100"
        min="0.0000001"
        step="any"
        disabled={submitting}
      />

      <Select
        label="Disponible para reclamar después de"
        value={String(releaseDelaySeconds)}
        onChange={(e) => setReleaseDelaySeconds(Number(e.target.value))}
        error={errors.releaseDelaySeconds}
        hint="Esto crea un lock temporal real usando predicados nativos de Stellar Claimable Balances."
        disabled={submitting}
      >
        {RELEASE_DELAY_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Select>

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ej: Cosecha temporada 2026, finca El Sol"
        hint="Ayuda a explicar el pago durante la demo o el pitch."
        disabled={submitting}
      />

      {submitError && (
        <div className="payment-form__error" role="alert">
          {submitError}
        </div>
      )}

      <div className="payment-form__actions">
        <Button type="submit" variant="primary" size="lg" loading={submitting}>
          {submitting ? 'Revisá Freighter…' : 'Crear y bloquear fondos'}
        </Button>
      </div>

      {submitting && sorobanEnabled && (
        <p className="payment-form__hint">
          Freighter puede abrirse dos veces: primero para el escrow y después para el registro Soroban.
        </p>
      )}
    </form>
  )
}
