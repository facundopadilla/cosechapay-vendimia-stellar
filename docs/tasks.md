# Tasks: CosechaPay MVP

## Phase 1 — Bootstrap and Foundation
- [x] Inicializar proyecto con Vite + React + TypeScript
- [x] Instalar y configurar shadcn/ui
- [x] Definir estructura base de carpetas (`app`, `pages`, `components`, `lib`, `hooks`, `types`)
- [x] Crear tipos base de `PaymentRecord` y `PaymentStatus`

## Phase 2 — Stellar and Local State Infrastructure
- [x] Configurar cliente Stellar SDK para testnet
- [x] Implementar adapter de wallet para Freighter
- [x] Crear utilidades Horizon para consultar Claimable Balances y transacciones
- [x] Implementar persistencia liviana en localStorage para metadata de pagos
- [x] Crear hooks `useWallet` y `usePayments`

## Phase 3 — Escrow Product Flow and Screens
- [x] Crear layout base y routing principal
- [x] Implementar pantalla dashboard/home
- [x] Implementar formulario de creación de pago
- [x] Implementar operación `createClaimableBalance`
- [x] Mostrar pagos activos con estado visual y link a explorer

## Phase 4 — Claim Flow, State Modeling, and Verification
- [x] Implementar pantalla de detalle de pago
- [x] Implementar operación `claimClaimableBalance`
- [x] Resolver derivación de estados (`draft`, `submitting`, `locked`, `claiming`, `claimed`, `failed`)
- [x] Sincronizar estado UI con Horizon después de create/claim
- [x] Validar happy path completo con 2 wallets de prueba

## Phase 5 — MVP Polish Only
- [x] Mejorar feedback visual: loading, errores, success states
- [x] Preparar datos/wallets/checklist de demo en vivo

## Phase 6 — Soroban Companion Layer
- [x] Implementar contrato `WorkAgreementRegistry` con mapping `claimable_balance_id -> agreement_hash`
- [x] Conectar frontend a Soroban RPC con helper mínimo reutilizando Stellar SDK
- [x] Ejecutar registro Soroban solo post-escrow y de forma best-effort
- [x] Mostrar estado/TX Soroban en el detalle del pago
- [x] Mantener kill switch por ausencia de contract ID/configuración

## Definition of Done
- [x] El empleador puede conectar wallet
- [x] Puede crear un pago con address + monto
- [x] Los fondos quedan bloqueados on-chain
- [x] La UI muestra estado correcto del pago
- [x] El cosechero puede reclamar el balance
- [x] Hay verificación visible en explorer / Horizon según el recurso
- [x] Existe checklist de demo y fallback básico
- [x] Soroban puede ejecutarse como companion step explícito o ser omitido sin romper el escrow

## Out of Scope
- [ ] Reemplazar Claimable Balances por Soroban
- [ ] Backend Django
- [ ] Auth tradicional
- [ ] Reportes complejos
- [ ] Disputas
- [ ] Multi-asset avanzado
