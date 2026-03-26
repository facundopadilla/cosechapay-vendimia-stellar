# Tasks: CosechaPay MVP

## Phase 1 — Bootstrap and Foundation
- [ ] Inicializar proyecto con Vite + React + TypeScript
- [ ] Instalar y configurar shadcn/ui
- [ ] Definir estructura base de carpetas (`app`, `pages`, `components`, `lib`, `hooks`, `types`)
- [ ] Crear tipos base de `PaymentRecord` y `PaymentStatus`

## Phase 2 — Stellar and Local State Infrastructure
- [ ] Configurar cliente Stellar SDK para testnet
- [ ] Implementar adapter de wallet para Freighter
- [ ] Crear utilidades Horizon para consultar Claimable Balances y transacciones
- [ ] Implementar persistencia liviana en localStorage para metadata de pagos
- [ ] Crear hooks `useWallet` y `usePayments`

## Phase 3 — Escrow Product Flow and Screens
- [ ] Crear layout base y routing principal
- [ ] Implementar pantalla dashboard/home
- [ ] Implementar formulario de creación de pago
- [ ] Implementar operación `createClaimableBalance`
- [ ] Mostrar pagos activos con estado visual y link a explorer

## Phase 4 — Claim Flow, State Modeling, and Verification
- [ ] Implementar pantalla de detalle de pago
- [ ] Implementar operación `claimClaimableBalance`
- [ ] Resolver derivación de estados (`draft`, `submitting`, `locked`, `claiming`, `claimed`, `failed`)
- [ ] Sincronizar estado UI con Horizon después de create/claim
- [ ] Validar happy path completo con 2 wallets de prueba

## Phase 5 — MVP Polish Only
- [ ] Mejorar feedback visual: loading, errores, success states
- [ ] Preparar datos/wallets/checklist de demo en vivo

## Phase 6 — Soroban Companion Layer
- [ ] Implementar contrato `WorkAgreementRegistry` con mapping `claimable_balance_id -> agreement_hash`
- [ ] Conectar frontend a Soroban RPC con helper mínimo reutilizando Stellar SDK
- [ ] Ejecutar registro Soroban solo post-escrow y de forma best-effort
- [ ] Mostrar estado/TX Soroban en el detalle del pago
- [ ] Mantener kill switch por ausencia de contract ID/configuración

## Definition of Done
- [ ] El empleador puede conectar wallet
- [ ] Puede crear un pago con address + monto
- [ ] Los fondos quedan bloqueados on-chain
- [ ] La UI muestra estado correcto del pago
- [ ] El cosechero puede reclamar el balance
- [ ] Hay verificación visible en explorer
- [ ] Existe checklist de demo y fallback básico

## Out of Scope
- [ ] Reemplazar Claimable Balances por Soroban
- [ ] Backend Django
- [ ] Auth tradicional
- [ ] Reportes complejos
- [ ] Disputas
- [ ] Multi-asset avanzado
