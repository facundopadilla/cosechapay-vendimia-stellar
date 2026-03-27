# Pitch + Demo Script (máximo 3 minutos)

## Cómo usar este guion

Este texto está pensado para **leerlo casi literal** mientras mostrás las slides y hacés la demo.

Objetivo:

- explicar el problema en segundos
- mostrar la decisión arquitectónica correcta
- demostrar la app funcionando de punta a punta

---

## Timing recomendado

- **Slides**: 1 minuto 20 segundos
- **Demo**: 1 minuto 25 segundos
- **Cierre**: 10 a 15 segundos

No te detengas demasiado en ninguna slide. El video tiene que sentirse ágil.

---

## Guion para leer

### Slide 1 — Título

> CosechaPay bloquea pagos de cosecha on-chain en Stellar antes de que empiece el trabajo.
>
> La idea es simple: que el cosechero no dependa solo de una promesa verbal.

Tiempo: **8 segundos**

---

### Slide 2 — El problema

> En trabajo rural informal, muchas veces el cosechero empieza a trabajar sin garantía real de que el pago exista.
>
> Si hay conflicto, no hay nada verificable. Solo palabra contra palabra.

Tiempo: **10 segundos**

---

### Slide 3 — La solución

> Nuestra solución es bloquear el dinero antes de la cosecha.
>
> El empleador crea el pago, los fondos quedan inmovilizados on-chain y el cosechero puede verificar que el dinero está reservado.

Tiempo: **10 segundos**

---

### Slide 4 — Cómo funciona

> El flujo tiene cuatro pasos.
>
> Primero se crea el escrow con Claimable Balances. Después, como paso opcional, el empleador puede registrar en Soroban un hash verificable del acuerdo. Luego el cosechero ve que el dinero está reservado. Y finalmente lo reclama con su wallet.

Tiempo: **16 segundos**

---

### Slide 5 — Arquitectura

> La decisión importante acá es que el escrow real vive en Claimable Balances nativos.
>
> Soroban no reemplaza el flujo principal. Lo acompaña como una capa verificable extra.
>
> Si Soroban se omite o falla, el pago principal sigue funcionando igual.

Tiempo: **16 segundos**

---

### Slide 6 — Flujo de datos

> No tenemos backend.
>
> La app construye la transacción, Freighter firma, Stellar guarda el escrow y después Soroban puede registrar el hash del acuerdo como companion layer opcional.

Tiempo: **12 segundos**

---

### Slide 7 — Demo

> Ahora lo vemos funcionando en vivo.
>
> Voy a crear un pago, mostrar el escrow bloqueado, elegir pagar Soroban, y después entrar como cosechero para reclamarlo.

Tiempo: **8 segundos**

---

## Demo en vivo

### Paso 1 — Home

Decir:

> Esta es la app. Acá el empleador crea pagos y el cosechero ve qué balances puede reclamar.

Mostrar:

- home
- wallet conectada
- botón de nuevo pago

Tiempo: **8 segundos**

---

### Paso 2 — Crear pago

Decir:

> Primero entra el empleador. Carga la dirección del cosechero, un monto chico y un lock corto para la demo.

Mostrar:

- formulario
- address del cosechero
- monto chico, por ejemplo `0.1 XLM`
- lock corto

Tiempo: **12 segundos**

---

### Paso 3 — Primera firma

Decir:

> Ahora Freighter firma la creación del escrow. Esta es una transacción real de Stellar.

Mostrar:

- popup de Freighter
- confirmación del pago

Tiempo: **10 segundos**

---

### Paso 4 — Escrow creado

Decir:

> Listo. El pago ya quedó bloqueado on-chain como Claimable Balance.
>
> Y ahora aparece un segundo paso explícito: pagar Soroban o saltearlo por ahora.

Mostrar:

- pantalla de `Fondos bloqueados`
- `TX creación`
- bloque con botones de Soroban

Tiempo: **12 segundos**

---

### Paso 5 — Pagar Soroban

Decir:

> Elijo pagar Soroban ahora. Freighter vuelve a abrirse para una segunda firma, pero esta vez solo para registrar el hash verificable del acuerdo.

Mostrar:

- botón `Pagar Soroban ahora`
- segunda firma en Freighter
- feedback de Soroban

Tiempo: **15 segundos**

---

### Paso 6 — Mostrar detalle

Decir:

> En el detalle del pago vemos el estado del escrow, el Claimable Balance ID y también el estado o la TX Soroban.

Mostrar:

- detalle del pago
- `Claimable Balance ID`
- bloque `Registro Soroban`
- `TX Soroban` si aparece

Tiempo: **12 segundos**

---

### Paso 7 — Reclamo del cosechero

Decir:

> Ahora cambio a la wallet del cosechero. La app detecta el balance y lo reclama directamente desde su wallet.

Mostrar:

- cambiar wallet
- reclamar
- firma final
- estado reclamado

Tiempo: **16 segundos**

---

## Cierre

> En resumen: usamos Claimable Balances como escrow nativo y Soroban como companion layer verificable.
>
> Convertimos una promesa verbal en un pago reservado, visible y trazable on-chain.

Tiempo: **12 segundos**

---

## Versión ultra corta por si te apurás

> CosechaPay bloquea pagos de cosecha on-chain antes de que empiece el trabajo.
>
> El escrow real vive en Claimable Balances nativos de Stellar y Soroban agrega una capa verificable opcional del acuerdo.
>
> Ahora lo muestro creando un pago, registrándolo en Soroban y reclamándolo desde la wallet del cosechero.

---

## Qué NO decir

- no expliques todo Stellar desde cero
- no expliques código
- no expliques internals del SDK
- no discutas demasiado la UI
- no hables más de 15 o 20 segundos por slide

---

## Checklist antes de grabar

- empleador en Testnet
- cosechero en Testnet
- ambas wallets fondeadas
- lock corto configurado
- flujo probado completo una vez
- Soroban funcionando con `.env.local` o Vercel
- contract ID cargado
- Freighter listo
- explorer abierto por si lo necesitás
