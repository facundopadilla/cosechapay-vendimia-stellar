# Design: CosechaPay MVP

## Technical Approach
SPA frontend-only en React que interactúa directamente con Stellar Testnet mediante `@stellar/stellar-sdk` para escribir transacciones y Horizon API / Soroban RPC para leer y registrar estado on-chain. El escrow se implementa con **Claimable Balances** como core. Soroban entra como **capa compañera mínima y best-effort**, sin reemplazar el mecanismo principal ni agregar backend.

## Architecture Decisions

| Decisión | Choice | Alternativas consideradas | Rationale |
|---|---|---|---|
| Mecanismo escrow | Claimable Balances | Soroban custom contract | Resuelve el caso MVP sin poner el release de fondos en código custom |
| Companion layer | Soroban registry opt-in | Mantener todo fuera de Soroban | Agrega una prueba verificable del acuerdo sin bloquear el happy path |
| Arquitectura app | Frontend-only SPA | React + Django API | Menos capas, menos puntos de falla, más velocidad |
| Lectura de datos | Horizon API | Backend indexer propio | Para MVP alcanza con lectura directa on-chain |
| Firma/autenticación | Freighter wallet | Auth tradicional o custodia propia | Reduce superficie técnica y mantiene demo real |
| Activo MVP | XLM testnet | USDC u otros assets | XLM no requiere trustline, el faucet de Testnet lo cubre directo, simplifica funding y testing; USDC diferido a una fase posterior |
| Estado de UI | On-chain + metadata local | Base de datos persistente | El estado real vive en Stellar; localStorage solo mejora UX |
| Navegación | 3 rutas simples | App compleja con roles separados | Menor fricción para construir y demostrar |

## Data Flow

```text
Employer UI
   │
   ├─ connect wallet ───────→ Freighter
   │
   ├─ create payment ───────→ Stellar SDK ───────→ Stellar Testnet
   │                                                  │
   │                                                  └─ Claimable Balance creado
   │
   └─ read status ──────────→ Horizon API ─────────→ UI state

Worker view
   └─ claim payment ────────→ Stellar SDK/Freighter ─→ Stellar Testnet
```

## Payment Flow
1. Empleador conecta Freighter.
2. Completa formulario: worker address, amount, description.
3. La app construye `createClaimableBalance`.
4. Freighter firma y envía la transacción.
5. Horizon confirma el balance y la app lo muestra como `locked`.
6. La app intenta registrar en Soroban `claimable_balance_id -> agreement_hash`.
7. Si Soroban falla, el pago sigue `locked` igual.
8. Cosechero reclama el balance.
9. La app vuelve a consultar Horizon y refleja `claimed`.

## Payment State Model

```ts
type PaymentStatus = 'draft' | 'submitting' | 'locked' | 'claiming' | 'claimed' | 'failed'

type PaymentRecord = {
  id: string
  claimantAddress: string
  employerAddress: string
  amount: string
  asset: 'XLM'   // XLM-only en el MVP
  description?: string
  status: PaymentStatus
  claimableBalanceId?: string
  createdAt: string
  txHash?: string
  sorobanTxHash?: string
}
```

Reglas:
- `locked`: existe Claimable Balance activo en Horizon
- `claimed`: el balance ya no está claimable y la operación de claim fue confirmada
- `failed`: error local o de red al firmar/enviar

## Proposed Folder Structure

| File | Action | Description |
|---|---|---|
| `src/main.tsx` | Create | entrypoint Vite |
| `src/app/router.tsx` | Create | rutas principales |
| `src/app/providers.tsx` | Create | providers globales |
| `src/pages/home-page.tsx` | Create | landing/dashboard inicial |
| `src/pages/create-payment-page.tsx` | Create | formulario de creación |
| `src/pages/payment-detail-page.tsx` | Create | detalle/estado/reclamo |
| `src/components/payments/payment-form.tsx` | Create | formulario de pago |
| `src/components/payments/payment-card.tsx` | Create | tarjeta resumen |
| `src/components/payments/payment-status-badge.tsx` | Create | badge por estado |
| `src/components/wallet/connect-wallet-button.tsx` | Create | conexión Freighter |
| `src/lib/stellar/client.ts` | Create | config SDK/Horizon |
| `src/lib/stellar/create-claimable-balance.ts` | Create | operación create |
| `src/lib/stellar/claim-balance.ts` | Create | operación claim |
| `src/lib/stellar/query-payments.ts` | Create | lecturas Horizon |
| `src/lib/storage/payment-drafts.ts` | Create | metadata localStorage |
| `src/types/payment.ts` | Create | tipos de dominio |
| `src/hooks/use-wallet.ts` | Create | estado wallet |
| `src/hooks/use-payments.ts` | Create | consultas + refresh |

## Interfaces / Contracts

```ts
export interface WalletAdapter {
  isConnected(): Promise<boolean>
  getPublicKey(): Promise<string>
  signAndSubmitXdr(xdr: string): Promise<{ hash: string }>
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|---|---|---|
| Unit | mapeo de estados, validaciones, parsers Horizon | Vitest |
| Integration | create/claim/query en testnet | pruebas manuales guiadas |
| E2E | happy path completo de demo | 2 wallets Freighter + checklist |

## Migration / Rollout
No migration required.

## Demo Risks and Mitigations
- **Freighter no disponible** → wallets y navegador preparados de antemano
- **Testnet inestable** → dejar balances precreados y video backup
- **Latencia de indexación** → mostrar loading y retry manual

## Open Questions
- [x] Usar claim inmediato o predicados temporales → **predicados nativos con time lock configurable (XLM-only)**
- [x] Confirmar si la vista del cosechero será con wallet propia → **sí, wallet Freighter propia**
