import type { PaymentRecord, PaymentStatus } from '@/types/payment'

const STORAGE_KEY = 'cosechapay:payments'

/** Load all payment records from localStorage */
export function loadPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PaymentRecord[]
  } catch {
    return []
  }
}

/** Persist the full payments array to localStorage */
function savePayments(payments: PaymentRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
}

/** Add a new payment record */
export function addPayment(payment: PaymentRecord): void {
  const payments = loadPayments()
  payments.unshift(payment)
  savePayments(payments)
}

/** Update specific fields of a payment by id */
export function updatePayment(
  id: string,
  patch: Partial<Omit<PaymentRecord, 'id'>>
): PaymentRecord | null {
  const payments = loadPayments()
  const index = payments.findIndex((p) => p.id === id)
  if (index === -1) return null

  payments[index] = { ...payments[index], ...patch }
  savePayments(payments)
  return payments[index]
}

/** Update a payment by claimable balance id */
export function updatePaymentByBalanceId(
  claimableBalanceId: string,
  patch: Partial<Omit<PaymentRecord, 'id'>>
): PaymentRecord | null {
  const payments = loadPayments()
  const index = payments.findIndex((p) => p.claimableBalanceId === claimableBalanceId)
  if (index === -1) return null

  payments[index] = { ...payments[index], ...patch }
  savePayments(payments)
  return payments[index]
}

/** Update only the status of a payment */
export function updatePaymentStatus(id: string, status: PaymentStatus): void {
  updatePayment(id, { status })
}

/** Get a single payment by id */
export function getPaymentById(id: string): PaymentRecord | null {
  return loadPayments().find((p) => p.id === id) ?? null
}

/** Get a single payment by claimable balance id */
export function getPaymentByBalanceId(claimableBalanceId: string): PaymentRecord | null {
  return loadPayments().find((p) => p.claimableBalanceId === claimableBalanceId) ?? null
}

/** Get all payments for a specific employer address */
export function getPaymentsByEmployer(employerAddress: string): PaymentRecord[] {
  return loadPayments().filter((p) => p.employerAddress === employerAddress)
}

/** Generate a simple UUID v4 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
