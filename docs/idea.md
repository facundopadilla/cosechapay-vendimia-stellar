# CosechaPay

## Resumen
CosechaPay es un MVP de hackathon para demostrar pagos de cosecha con fondos bloqueados on-chain usando Stellar. El objetivo no es resolver todo el dominio rural, sino probar una promesa simple: **el empleador bloquea el pago antes del trabajo y el cosechero puede verificar que el dinero existe**.

## Problema
En trabajo rural e informal, el cosechero muchas veces no tiene garantía de que el pago prometido realmente esté reservado. Eso genera desconfianza y dependencia de acuerdos verbales.

## Propuesta
Permitir que un empleador cree un pago de cosecha y bloquee fondos en Stellar Testnet usando **Claimable Balances**. Luego, de forma opcional, puede registrar en Soroban un hash verificable del acuerdo. El cosechero después reclama ese pago y ambas partes tienen visibilidad del estado on-chain.

## Objetivo del MVP
Construir una demo confiable, simple y pitcheable para 1 developer en hackathon.

## Scope del MVP

### Incluye
- Conexión de wallet del empleador
- Creación de pago con:
  - dirección pública del cosechero
  - monto en XLM
  - descripción opcional
  - time lock configurable (predicados nativos de Claimable Balances)
- Bloqueo de fondos con Claimable Balance en XLM
- Companion layer Soroban opcional para registrar `claimable_balance_id -> agreement_hash`
- Vista de pagos activos
- Estado visual del pago
- Reclamo/liberación del pago
- Link a explorer para validación on-chain

### No incluye
- Multi-asset / USDC (diferido a fase posterior)
- Backend Django
- Registro/login tradicional
- Dashboard complejo
- Reportes
- Disputas
- UX móvil avanzada

## Decisiones estratégicas

### Elegido para MVP
- **Frontend only**
- **React + TypeScript + Vite**
- **shadcn/ui**
- **Stellar SDK + Horizon API**
- **Stellar Testnet**
- **Claimable Balances** como mecanismo de escrow
- **Soroban** como companion layer opcional y no crítica

### Rechazado para MVP
- **Soroban como core escrow**: demasiado riesgo para 1 dev en hackathon
- **Django backend**: capa innecesaria para esta primera versión

## Narrativa de pitch
"El empleador bloquea el pago antes de que empiece la cosecha. El cosechero sabe que el dinero está ahí. Soroban puede sumar una huella verificable del acuerdo sin tocar el escrow principal. Cuando termina el trabajo, el pago se reclama y queda todo visible on-chain."

## Riesgos principales
- Fallo de demo por wallet o extensión no instalada
- Dependencia de testnet en vivo
- Complejidad extra si se agregan roles o backend

## Mitigaciones
- Usar wallets de prueba preconfiguradas
- Tener balances precreados para la demo
- Mantener un único happy path
- Tener video backup del flujo

## Criterio de éxito
El MVP es exitoso si permite mostrar en pocos minutos:
1. conexión de wallet
2. creación de pago
3. fondos bloqueados on-chain
4. reclamo/liberación
5. prueba visible en explorer u Horizon
