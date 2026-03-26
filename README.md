# CosechaPay

> Pagos de cosecha bloqueados en Stellar — sin intermediarios, sin promesas verbales.

## El problema

En trabajo rural informal, el cosechero no tiene garantía de que el pago prometido esté reservado antes de empezar. Todo depende de acuerdos verbales sin respaldo verificable.

## La solución

CosechaPay permite que un empleador bloquee los fondos on-chain **antes** de que comience el trabajo. El dinero queda inmovilizado en un Claimable Balance de Stellar con un time lock configurable. Cuando el trabajo termina, el cosechero lo reclama directamente con su wallet.

**Sin backend. Sin contrato custom. Sin custodios.**

## Cómo funciona

```
Empleador → crea pago → fondos bloqueados como Claimable Balance en Stellar Testnet
           (time lock: 1 min / 1 hora / 1 día — configurable)

Cosechero → conecta wallet → ve su balance pendiente → reclama tras el unlock
```

El escrow usa **Claimable Balances nativos** de Stellar con **predicates temporales** — sin Soroban, sin código custom, sin riesgo de fallo en contrato.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript + Vite |
| Blockchain | Stellar Testnet (Horizon API) |
| Wallet | Freighter |
| Escrow | Claimable Balances nativos + time-lock predicates |
| Almacenamiento | localStorage (metadata de UI) |

## Demo en 60 segundos

1. **Empleador** conecta Freighter en Stellar Testnet
2. Completa el formulario: dirección del cosechero, monto, tiempo de bloqueo
3. Freighter firma una transacción real (`CreateClaimableBalance` con XLM)
4. La app muestra el pago como **bloqueado** — con Balance ID y link al explorer
5. **Cosechero** conecta su wallet — ve el balance disponible
6. Reclama los fondos — otra firma real en Freighter
7. El estado queda verificable on-chain en [Stellar Expert](https://stellar.expert/explorer/testnet)

## Setup local

```bash
# Requisitos: Node 20+, pnpm
pnpm install
pnpm dev
```

Necesitás dos wallets Freighter en Stellar Testnet, ambas fondeadas (podés usar el [faucet oficial](https://laboratory.stellar.org/#account-creator?network=test)).

## Estructura

```
src/
  lib/stellar/         # SDK: createClaimableBalance, claimBalance, queryPayments
  pages/               # home, create-payment, payment-detail
  components/payments/ # PaymentForm, PaymentCard, ClaimableBalanceCard
  hooks/               # usePayments, useWallet
  types/               # PaymentRecord, CreatePaymentInput
```

## Por qué Stellar

- **Claimable Balances** permiten escrow nativo sin contrato custom
- **Predicates temporales** dan control de release sin lógica adicional
- **Freighter** provee UX de firma estándar
- **Horizon API** da lectura directa del estado on-chain
- Faucet público en Testnet permite demo sin fricción

## Próximas fases (post-hackathon)

- Soroban: condiciones de release más expresivas (aprobación, disputa)
- Multi-asset: soporte USDC y otros tokens
- Roles separados y flujo móvil

## Links

- Demo: _[pendiente de deploy]_
- Video: _[pendiente]_
- Track: Stellar — Claimable Balances / DeFi for good

---

Built at [Vendimia Hackathon](https://github.com/your-org/vendimia-hackathon) · Stellar Testnet
