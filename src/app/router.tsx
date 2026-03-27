import { Navigate, Routes, Route } from 'react-router-dom'
import type { WalletState } from '@/types/payment'
import type { usePayments } from '@/hooks/use-payments'
import { HomePage } from '@/pages/home-page'
import { CreatePaymentPage } from '@/pages/create-payment-page'
import { PaymentDetailPage } from '@/pages/payment-detail-page'

type PaymentsState = ReturnType<typeof usePayments>

interface RouterProviderProps {
  wallet: WalletState
  payments: PaymentsState
}

export function RouterProvider({ wallet, payments }: RouterProviderProps) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/payments" replace />} />
      <Route
        path="/payments"
        element={
          <HomePage
            wallet={wallet}
            payments={payments.payments}
            claimableBalances={payments.claimableBalances}
            loading={payments.loading}
            onRefresh={payments.refresh}
            onClaimBalance={payments.claimClaimableBalance}
            view="payments"
          />
        }
      />
      <Route
        path="/claimables"
        element={
          <HomePage
            wallet={wallet}
            payments={payments.payments}
            claimableBalances={payments.claimableBalances}
            loading={payments.loading}
            onRefresh={payments.refresh}
            onClaimBalance={payments.claimClaimableBalance}
            view="claimables"
          />
        }
      />
      <Route
        path="/payments/new"
        element={
          <CreatePaymentPage
            wallet={wallet}
            onCreatePayment={payments.createPayment}
            onRegisterSoroban={payments.registerPaymentInSoroban}
            onSkipSoroban={payments.skipSorobanRegistration}
          />
        }
      />
      <Route
        path="/payments/:id"
        element={
          <PaymentDetailPage
            wallet={wallet}
            onClaim={payments.claimPayment}
            onRegisterSoroban={payments.registerPaymentInSoroban}
            onSkipSoroban={payments.skipSorobanRegistration}
            onSync={payments.syncPaymentStatus}
          />
        }
      />
    </Routes>
  )
}
