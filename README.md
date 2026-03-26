# CosechaPay

> 🌾 Pagos de cosecha bloqueados on-chain en Stellar, con escrow nativo y una capa Soroban verificable.

![React](https://img.shields.io/badge/React-18-1f6feb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-f59e0b?style=for-the-badge&logo=vite&logoColor=white)
![Stellar](https://img.shields.io/badge/Stellar-Testnet-111827?style=for-the-badge&logo=stellar&logoColor=white)
![Freighter](https://img.shields.io/badge/Freighter-Wallet-16a34a?style=for-the-badge)
![Soroban](https://img.shields.io/badge/Soroban-Companion_Layer-7c3aed?style=for-the-badge)

## 🚀 Demo

- Demo live: https://cosechapay-vendimia-stellar.vercel.app/
- Track: Stellar - Claimable Balances / DeFi for good
- Video: backup en preparacion

## 🧩 El problema

En trabajo rural informal, el cosechero muchas veces empieza a trabajar sin garantia real de que el pago prometido exista.

El acuerdo depende de confianza verbal, mensajes sueltos o promesas que no tienen respaldo verificable. Eso genera tres problemas concretos:

- ⚠️ el empleador puede prometer sin inmovilizar fondos
- 👀 el cosechero no tiene prueba fuerte antes de empezar
- 🤷 si hay conflicto, nadie puede verificar facil que estaba reservado y que no

## ✅ La solucion

CosechaPay hace una cosa simple, pero potente: **bloquea el pago antes de que empiece el trabajo**.

- El empleador crea un pago en Stellar Testnet
- Los fondos quedan inmovilizados como un **Claimable Balance** nativo
- El cosechero puede ver que el dinero existe on-chain
- Cuando se cumple el unlock, reclama desde su wallet
- Ademas, la app registra en Soroban un **hash verificable del acuerdo** como companion layer

La clave conceptual es esta: el core del producto **NO depende de Soroban**.

- 🛡️ El escrow real vive en **Claimable Balances nativos**
- 🔎 Soroban suma verificabilidad extra
- 🔌 Si Soroban falla, el happy path principal sigue funcionando

## 🛠️ Como funciona

```text
Empleador
  -> conecta Freighter
  -> crea pago
  -> Stellar crea Claimable Balance con time lock
  -> CosechaPay intenta registrar agreement_hash en Soroban

Cosechero
  -> conecta Freighter
  -> ve el balance pendiente
  -> reclama fondos cuando se abre la ventana
```

## 🏗️ Arquitectura en una linea

**Claimable Balances para escrow + Soroban para registro verificable del acuerdo.**

## 📚 Stack

| Capa | Tecnologia | Rol |
|---|---|---|
| Frontend | React + TypeScript + Vite | SPA sin backend |
| Wallet | Freighter | Firma de transacciones |
| Lectura on-chain | Horizon API | Estado de balances y transacciones |
| Escrow core | Claimable Balances nativos | Reserva real de fondos |
| Time lock | Predicates temporales de Stellar | Release simple y confiable |
| Companion layer | Soroban `WorkAgreementRegistry` | `claimable_balance_id -> agreement_hash` |
| Persistencia UI | localStorage | Metadata local del frontend |

## 🤔 Por que esta arquitectura esta bien

- 🧱 **Menos riesgo**: el release de fondos no depende de un contrato custom
- 🎬 **Mejor demo**: el happy path funciona con primitives nativas de Stellar
- ⭐ **Mejor narrativa para el track**: Soroban aparece visible, sin poner en peligro la UX principal
- 🚫 **Sin backend**: menos capas, menos puntos de falla, menos tiempo perdido

## 🪄 Companion layer Soroban

El contrato `WorkAgreementRegistry` guarda una relacion minima:

```text
claimable_balance_id -> agreement_hash
```

Reglas de integracion:

- 🔁 se ejecuta solo despues de crear exitosamente el Claimable Balance
- 🫶 es **best-effort**
- 🧯 si Soroban falla, el pago principal igual queda creado
- 🖥️ la UI muestra estado, hash y tx de Soroban solo si existen
- 🔕 el kill switch es no definir `VITE_SOROBAN_WORK_AGREEMENT_CONTRACT_ID`

## 🎤 Experiencia de demo

En menos de 1 minuto se puede mostrar:

1. empleador conecta wallet
2. crea pago con address, monto y lock
3. Freighter firma una transaccion real de Stellar
4. la app muestra el balance bloqueado y su tx
5. la app intenta registrar el acuerdo en Soroban
6. la app muestra estado y TX Soroban en el detalle
7. el cosechero entra con su wallet
8. reclama el balance
9. todo queda verificable on-chain

## 🧪 Setup local

```bash
pnpm install
pnpm dev
```

Necesitas:

- Node 20+
- pnpm
- 2 wallets Freighter en Stellar Testnet
- ambas wallets activadas y fondeadas

## 🔐 Variables de entorno

Para activar la companion layer Soroban en frontend:

```bash
VITE_SOROBAN_WORK_AGREEMENT_CONTRACT_ID=CA5NY3WINXKRKPWGDLEMH4PJCQRT4FEMKYGZEXWYRHUWHYYESKNSR75M
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
```

Si `VITE_SOROBAN_WORK_AGREEMENT_CONTRACT_ID` no existe, la app sigue funcionando en modo XLM-only con degradacion segura.

## 📜 Contract ID de testnet

- Contract ID: `CA5NY3WINXKRKPWGDLEMH4PJCQRT4FEMKYGZEXWYRHUWHYYESKNSR75M`
- Deploy tx: `170c4063f95fb6ea81db4d9c0c2167e63b7e54c2fbe1df5c3ceb8db149450751`

## 📍 Estado actual

- ✅ Deploy publico activo en Vercel
- ✅ Escrow XLM-only estable
- ✅ Companion layer Soroban implementada
- ✅ Sin backend
- 🎥 Video final pendiente de grabacion

## 🔭 Proximas fases

- reglas de release mas expresivas
- multi-asset
- roles separados
- mejor experiencia mobile

---

Built at [Vendimia Hackathon](https://github.com/your-org/vendimia-hackathon) on Stellar Testnet. 💫
