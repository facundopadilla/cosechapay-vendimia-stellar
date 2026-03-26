import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PaymentRecord, WalletState } from '@/types/payment'
import { PaymentCard } from '@/components/payments/payment-card'
import { ClaimableBalanceCard } from '@/components/payments/claimable-balance-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { HorizonClaimableBalance } from '@/lib/stellar/query-payments'
import { getPaymentByBalanceId } from '@/lib/storage/payment-drafts'
import './home-page.css'

const PAGE_SIZE = 4

interface HomePageProps {
  wallet: WalletState
  payments: PaymentRecord[]
  claimableBalances: HorizonClaimableBalance[]
  loading: boolean
  onRefresh: () => Promise<void>
  onClaimBalance: (balanceId: string) => Promise<void>
  view?: 'overview' | 'payments' | 'claimables'
}

export function HomePage({
  wallet,
  payments,
  claimableBalances,
  loading,
  onRefresh,
  onClaimBalance,
  view = 'overview',
}: HomePageProps) {
  const [paymentsQuery, setPaymentsQuery] = useState('')
  const [claimablesQuery, setClaimablesQuery] = useState('')
  const [paymentsPage, setPaymentsPage] = useState(1)
  const [claimablesPage, setClaimablesPage] = useState(1)

  const filteredPayments = useMemo(() => {
    const term = paymentsQuery.trim().toLowerCase()
    if (!term) return payments

    return payments.filter((payment) => {
      const haystack = [
        payment.claimantAddress,
        payment.description,
        payment.txHash,
        payment.claimableBalanceId,
        payment.amount,
        payment.asset,
        payment.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [payments, paymentsQuery])

  const filteredClaimables = useMemo(() => {
    const term = claimablesQuery.trim().toLowerCase()
    if (!term) return claimableBalances

    return claimableBalances.filter((balance) => {
      const haystack = [balance.id, balance.sponsor, balance.amount, balance.asset].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, [claimableBalances, claimablesQuery])

  const paginatedPayments = useMemo(() => {
    const start = (paymentsPage - 1) * PAGE_SIZE
    return filteredPayments.slice(start, start + PAGE_SIZE)
  }, [filteredPayments, paymentsPage])

  const paginatedClaimables = useMemo(() => {
    const start = (claimablesPage - 1) * PAGE_SIZE
    return filteredClaimables.slice(start, start + PAGE_SIZE)
  }, [filteredClaimables, claimablesPage])

  const paymentsTotalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE))
  const claimablesTotalPages = Math.max(1, Math.ceil(filteredClaimables.length / PAGE_SIZE))
  const showPaymentsSection = view === 'overview' || view === 'payments'
  const showClaimablesSection = view === 'overview' || view === 'claimables'
  const showExplainer = view === 'overview'

  return (
    <div className="home-page">
      {/* Hero / intro when no wallet connected */}
      {!wallet.isConnected && (
        <div className="home-page__hero">
          <h1 className="home-page__title">Pagos de cosecha bloqueados on-chain</h1>
          <p className="home-page__subtitle">
            El empleador bloquea el pago antes de que empiece la cosecha.
            El cosechero sabe que el dinero está ahí.
            Cuando termina el trabajo, el pago se reclama y queda todo visible on-chain.
          </p>
          <div className="home-page__cta-note">
            Conectá tu wallet Freighter para comenzar.
          </div>
        </div>
      )}

      {/* Payments section */}
      {wallet.isConnected && showPaymentsSection && (
        <div className="home-page__section" id="payments">
          <div className="home-page__section-header">
            <div>
              <h2 className="home-page__section-title">Mis pagos activos</h2>
              <p className="home-page__section-sub">
                Pagos creados desde esta wallet en esta sesión.
              </p>
            </div>
            <div className="home-page__section-actions">
              <Button variant="ghost" size="sm" onClick={onRefresh} disabled={loading}>
                {loading ? 'Actualizando…' : 'Actualizar'}
              </Button>
              <Link to="/payments/new">
                <Button variant="primary" size="sm">+ Nuevo pago</Button>
              </Link>
            </div>
          </div>

          <div className="home-page__role-note">
            Estás viendo la vista del <strong>empleador</strong>: pagos creados desde esta wallet.
          </div>

          <div className="home-page__toolbar">
            <Input
              value={paymentsQuery}
              onChange={(event) => {
                setPaymentsQuery(event.target.value)
                setPaymentsPage(1)
              }}
              placeholder="Buscar por address, estado, monto o descripción"
              aria-label="Buscar pagos creados"
            />
            <div className="home-page__results-note">
              {filteredPayments.length} resultado{filteredPayments.length === 1 ? '' : 's'}
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="home-page__empty">
              <p>
                {payments.length === 0
                  ? 'Todavía no creaste ningún pago.'
                  : 'No encontramos pagos que coincidan con tu búsqueda.'}
              </p>
              <Link to="/payments/new">
                <Button variant="primary" size="md">Crear primer pago</Button>
              </Link>
            </div>
          ) : (
            <>
            <div className="home-page__list">
              {paginatedPayments.map((p) => (
                <PaymentCard key={p.id} payment={p} />
              ))}
            </div>
            {filteredPayments.length > PAGE_SIZE && (
              <div className="home-page__pagination">
                <span className="home-page__pagination-note">
                  Mostrando {(paymentsPage - 1) * PAGE_SIZE + 1}
                  –
                  {Math.min(paymentsPage * PAGE_SIZE, filteredPayments.length)} de {filteredPayments.length}
                </span>
                <div className="home-page__pagination-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaymentsPage((page) => Math.max(1, page - 1))}
                    disabled={paymentsPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="home-page__pagination-page">Página {paymentsPage} / {paymentsTotalPages}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPaymentsPage((page) => Math.min(paymentsTotalPages, page + 1))}
                    disabled={paymentsPage === paymentsTotalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {wallet.isConnected && showClaimablesSection && (
        <div className="home-page__section" id="claimables">
          <div className="home-page__section-header">
            <div>
              <h2 className="home-page__section-title">Pagos que puedo reclamar</h2>
              <p className="home-page__section-sub">
                Balances que Horizon detecta para la wallet conectada como cosechero.
              </p>
            </div>
          </div>

          <div className="home-page__role-note home-page__role-note--claimant">
            Estás viendo la vista del <strong>cosechero</strong>: balances donde esta wallet puede reclamar fondos.
          </div>

          <div className="home-page__toolbar">
            <Input
              value={claimablesQuery}
              onChange={(event) => {
                setClaimablesQuery(event.target.value)
                setClaimablesPage(1)
              }}
              placeholder="Buscar por sponsor, monto o balance ID"
              aria-label="Buscar balances reclamables"
            />
            <div className="home-page__results-note">
              {filteredClaimables.length} reclamable{filteredClaimables.length === 1 ? '' : 's'}
            </div>
          </div>

          {filteredClaimables.length === 0 ? (
            <div className="home-page__empty">
              <p>
                {claimableBalances.length === 0
                  ? 'No hay balances reclamables para esta wallet.'
                  : 'No encontramos balances que coincidan con tu búsqueda.'}
              </p>
            </div>
          ) : (
            <>
            <div className="home-page__list">
              {paginatedClaimables.map((balance) => (
                <ClaimableBalanceCard
                  key={balance.id}
                  balance={balance}
                  onClaim={onClaimBalance}
                  payment={getPaymentByBalanceId(balance.id)}
                />
              ))}
            </div>
            {filteredClaimables.length > PAGE_SIZE && (
              <div className="home-page__pagination">
                <span className="home-page__pagination-note">
                  Mostrando {(claimablesPage - 1) * PAGE_SIZE + 1}
                  –
                  {Math.min(claimablesPage * PAGE_SIZE, filteredClaimables.length)} de {filteredClaimables.length}
                </span>
                <div className="home-page__pagination-actions">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClaimablesPage((page) => Math.max(1, page - 1))}
                    disabled={claimablesPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="home-page__pagination-page">Página {claimablesPage} / {claimablesTotalPages}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClaimablesPage((page) => Math.min(claimablesTotalPages, page + 1))}
                    disabled={claimablesPage === claimablesTotalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      )}

      {/* How it works — always visible */}
      {showExplainer && <div className="home-page__explainer">
        <h3 className="home-page__explainer-title">¿Cómo funciona?</h3>
        <ol className="home-page__steps">
          <li>
            <strong>Conectás tu wallet</strong> Freighter (empleador)
          </li>
          <li>
            <strong>Creás un pago</strong> con la dirección del cosechero y el monto en XLM
          </li>
          <li>
            <strong>Los fondos quedan bloqueados</strong> on-chain como Claimable Balance en Stellar Testnet
          </li>
          <li>
            El cosechero <strong>reclama el balance</strong> con su propia wallet
          </li>
          <li>
            Todo queda <strong>visible en el explorer</strong> de Stellar
          </li>
        </ol>
      </div>}
    </div>
  )
}
