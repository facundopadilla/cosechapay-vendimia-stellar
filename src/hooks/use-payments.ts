import { useState, useCallback, useEffect } from 'react'
import type { PaymentRecord, CreatePaymentInput } from '@/types/payment'
import {
  loadPayments,
  addPayment,
  updatePayment,
  updatePaymentByBalanceId,
  getPaymentById,
  generateId,
} from '@/lib/storage/payment-drafts'
import { createClaimableBalance } from '@/lib/stellar/create-claimable-balance'
import { claimBalance } from '@/lib/stellar/claim-balance'
import {
  getClaimableBalancesForClaimant,
  getClaimableBalanceIdFromTransaction,
  isBalanceStillClaimable,
  type HorizonClaimableBalance,
} from '@/lib/stellar/query-payments'
import type { WalletAdapter } from '@/lib/wallet/freighter-adapter'
import { isSorobanCompanionEnabled } from '@/lib/soroban/client'
import { runBestEffortWorkAgreementRegistration } from '@/lib/soroban/companion-registration'
import { registerWorkAgreement } from '@/lib/soroban/register-work-agreement'

/**
 * usePayments — manages the payment list and Stellar operations.
 *
 * Requires a WalletAdapter so the hook is decoupled from Freighter directly.
 */
export function usePayments(wallet: WalletAdapter | null, employerAddress: string | null) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [claimableBalances, setClaimableBalances] = useState<HorizonClaimableBalance[]>([])
  const [loading, setLoading] = useState(false)

  /** Reload payments from localStorage */
  const refresh = useCallback(async () => {
    const all = loadPayments()
    if (employerAddress) {
      setPayments(all.filter((p) => p.employerAddress === employerAddress))
    } else {
      setPayments(all)
    }

    if (!employerAddress) {
      setClaimableBalances([])
      return
    }

    try {
      const balances = await getClaimableBalancesForClaimant(employerAddress)
      setClaimableBalances(balances)
    } catch {
      setClaimableBalances([])
    }
  }, [employerAddress])

  // Load on mount and when employerAddress changes
  useEffect(() => {
    void refresh()
  }, [refresh])

  /**
   * Create a new payment:
   * 1. Save a local draft record with status=submitting
   * 2. Call createClaimableBalance on Stellar
   * 3. Update the record with the returned txHash and balanceId
   */
  const createPayment = useCallback(
    async (input: CreatePaymentInput): Promise<PaymentRecord> => {
      if (!wallet) throw new Error('Wallet no conectada')
      if (!employerAddress) throw new Error('No hay dirección de empleador')

      const record: PaymentRecord = {
        id: generateId(),
        claimantAddress: input.claimantAddress,
        employerAddress,
        amount: input.amount,
        asset: input.asset,
        releaseDelaySeconds: input.releaseDelaySeconds,
        description: input.description,
        status: 'submitting',
        createdAt: new Date().toISOString(),
      }

      addPayment(record)
      void refresh()
      setLoading(true)

      try {
        const { txHash, claimableBalanceId } = await createClaimableBalance({
          employerPublicKey: employerAddress,
          claimantPublicKey: input.claimantAddress,
          amount: input.amount,
          releaseDelaySeconds: input.releaseDelaySeconds,
          signAndSubmit: (xdr) => wallet.signAndSubmitXdr(xdr),
        })

        const updated = updatePayment(record.id, {
          status: 'locked',
          txHash,
          claimableBalanceId: claimableBalanceId ?? undefined,
          sorobanRegistrationStatus:
            claimableBalanceId && isSorobanCompanionEnabled() ? 'pending' : 'disabled',
          sorobanError: undefined,
        })

        void refresh()

        if (updated && claimableBalanceId && isSorobanCompanionEnabled()) {
          void runBestEffortWorkAgreementRegistration({
            register: () => registerWorkAgreement({ payment: updated, wallet }),
            persist: (patch) => {
              updatePayment(record.id, patch)
            },
            onSettled: refresh,
          })
        }

        return updated!
      } catch (err) {
        updatePayment(record.id, { status: 'failed' })
        void refresh()
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, employerAddress, refresh]
  )

  /**
   * Claim a locked payment.
   * The caller should be the claimant; their wallet signs the claim tx.
   */
  const claimPayment = useCallback(
    async (paymentId: string): Promise<void> => {
      if (!wallet) throw new Error('Wallet no conectada')

      const payment = getPaymentById(paymentId)
      if (!payment) throw new Error('Pago no encontrado')
      if (!payment.claimableBalanceId) throw new Error('El pago no tiene un balance ID')

      updatePayment(paymentId, { status: 'claiming' })
      void refresh()
      setLoading(true)

      try {
        const publicKey = await wallet.getPublicKey()
        const { txHash } = await claimBalance({
          claimantPublicKey: publicKey,
          claimableBalanceId: payment.claimableBalanceId,
          signAndSubmit: (xdr) => wallet.signAndSubmitXdr(xdr),
        })

        updatePayment(paymentId, {
          status: 'claimed',
          claimTxHash: txHash,
        })

        void refresh()
      } catch (err) {
        updatePayment(paymentId, { status: 'locked' })
        void refresh()
        throw err
      } finally {
        setLoading(false)
      }
    },
    [wallet, refresh]
  )

  /**
   * Claim a balance discovered directly from Horizon as claimant.
   * Useful for the cosechero flow, where the payment may not exist in local employer state.
   */
  const claimClaimableBalance = useCallback(
    async (claimableBalanceId: string): Promise<void> => {
      if (!wallet) throw new Error('Wallet no conectada')

      setLoading(true)

      try {
        const publicKey = await wallet.getPublicKey()
        const { txHash } = await claimBalance({
          claimantPublicKey: publicKey,
          claimableBalanceId,
          signAndSubmit: (xdr) => wallet.signAndSubmitXdr(xdr),
        })

        updatePaymentByBalanceId(claimableBalanceId, {
          status: 'claimed',
          claimTxHash: txHash,
        })

        await refresh()
      } finally {
        setLoading(false)
      }
    },
    [wallet, refresh]
  )

  /**
   * Sync a payment's status against Horizon.
   * If the balance is gone, mark as claimed; if still there, mark as locked.
   */
  const syncPaymentStatus = useCallback(
    async (paymentId: string): Promise<void> => {
      const payment = getPaymentById(paymentId)
      if (!payment) return
      if (payment.status === 'claimed' || payment.status === 'failed') return

      let claimableBalanceId: string | null | undefined = payment.claimableBalanceId

      if (!claimableBalanceId && payment.txHash) {
        claimableBalanceId = await getClaimableBalanceIdFromTransaction(payment.txHash)

        if (claimableBalanceId) {
          updatePayment(paymentId, { claimableBalanceId: claimableBalanceId ?? undefined })
          void refresh()
        }
      }

      if (!claimableBalanceId) return

      const stillClaimable = await isBalanceStillClaimable(claimableBalanceId)
      if (!stillClaimable && payment.status === 'locked') {
        updatePayment(paymentId, { status: 'claimed' })
        void refresh()
      } else if (stillClaimable && payment.status !== 'locked') {
        updatePayment(paymentId, { status: 'locked' })
        void refresh()
      }
    },
    [refresh]
  )

  return {
    payments,
    claimableBalances,
    loading,
    refresh,
    createPayment,
    claimPayment,
    claimClaimableBalance,
    syncPaymentStatus,
  }
}
