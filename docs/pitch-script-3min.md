# Pitch + Demo Script (3 minutos)

## Objetivo

Tener un guion corto, claro y ejecutable para presentar **las diapositivas** y hacer **la demo en vivo** sin pasar los 3 minutos.

La idea no es explicar todo. La idea es contar:

1. el problema
2. por qué esta solución tiene sentido
3. cómo se ve funcionando en vivo

---

## Estructura recomendada

- **Pitch con slides**: 1 minuto 30 segundos aprox.
- **Demo en vivo**: 1 minuto 15 segundos aprox.
- **Cierre**: 15 segundos aprox.

---

## Guion completo

### Slide 1 - Título

> CosechaPay es una app para bloquear pagos de cosecha on-chain en Stellar antes de que empiece el trabajo.
>
> La idea es simple: que el cosechero no dependa solo de una promesa verbal.

Tiempo: **10 segundos**

---

### Slide 2 - El problema

> En trabajo rural informal, muchas veces el cosechero empieza a trabajar sin garantía real de que el pago exista.
>
> El acuerdo depende de confianza verbal, y si hay conflicto, no hay nada verificable.

Tiempo: **12 segundos**

---

### Slide 3 - La solución

> CosechaPay resuelve eso bloqueando el dinero antes de que empiece la cosecha.
>
> El empleador crea un pago, los fondos quedan inmovilizados on-chain, y el cosechero puede ver que el dinero está ahí.

Tiempo: **12 segundos**

---

### Slide 4 - Cómo funciona

> El flujo tiene cuatro pasos.
>
> Primero se bloquea el pago con Claimable Balances. Después registramos un hash verificable del acuerdo en Soroban. Luego el cosechero ve que el dinero está reservado. Y finalmente lo reclama con su wallet.

Tiempo: **18 segundos**

---

### Slide 5 - Arquitectura

> La decisión importante acá es arquitectónica.
>
> El escrow real vive en Claimable Balances nativos de Stellar. Soroban no reemplaza eso: lo acompaña con una capa verificable extra.
>
> Si Soroban falla, el flujo principal sigue funcionando.

Tiempo: **18 segundos**

---

### Slide 6 - Flujo de datos

> No tenemos backend.
>
> La app construye la transacción, Freighter firma, Stellar guarda el escrow y Soroban registra el hash del acuerdo como companion layer.

Tiempo: **12 segundos**

---

### Slide 7 - Demo en vivo

> Ahora lo vemos funcionando de verdad.
>
> Voy a crear un pago como empleador, mostrar el escrow bloqueado, el registro Soroban, y después entrar como cosechero para reclamarlo.

Tiempo: **10 segundos**

---

## Demo en vivo

### Paso 1 - Mostrar home

Decir:

> Esta es la app. Acá el empleador crea pagos y el cosechero ve qué balances puede reclamar.

Mostrar:

- home
- wallet conectada
- botón de nuevo pago

Tiempo: **10 segundos**

---

### Paso 2 - Crear pago como empleador

Decir:

> Primero entra el empleador. Carga la dirección del cosechero, el monto y un lock corto para la demo.

Mostrar:

- formulario
- address del cosechero
- monto chico, por ejemplo `0.1 XLM`
- lock corto

Tiempo: **15 segundos**

---

### Paso 3 - Firmar con Freighter

Decir:

> Ahora Freighter firma una transacción real de Stellar. No estamos simulando nada.

Mostrar:

- popup de Freighter si aparece
- confirmación de la transacción

Tiempo: **10 segundos**

---

### Paso 4 - Mostrar pago bloqueado + Soroban

Decir:

> Ahora el pago quedó bloqueado on-chain como Claimable Balance.
>
> Y además, sin tocar el escrow principal, la app registra en Soroban un hash verificable del acuerdo.

Mostrar:

- estado bloqueado
- tx de creación
- claimable balance id
- estado o tx Soroban

Tiempo: **18 segundos**

---

### Paso 5 - Cambiar a la wallet del cosechero

Decir:

> Ahora entra el cosechero. La app consulta Horizon y detecta qué balances puede reclamar esta wallet.

Mostrar:

- cambiar wallet
- sección de balances reclamables

Tiempo: **10 segundos**

---

### Paso 6 - Reclamar fondos

Decir:

> El cosechero reclama los fondos directamente con su wallet. El dinero ya estaba reservado desde antes.

Mostrar:

- click en reclamar
- firma en Freighter
- estado final

Tiempo: **15 segundos**

---

## Cierre

> En resumen: usamos Claimable Balances como escrow nativo y Soroban como companion layer verificable.
>
> El resultado es una app simple, sin backend, que convierte una promesa verbal en un pago reservado y trazable.

Tiempo: **15 segundos**

---

## Versión ultra corta por si te apurás

> CosechaPay bloquea pagos de cosecha on-chain antes de que empiece el trabajo.
>
> El escrow real vive en Claimable Balances nativos de Stellar, y Soroban agrega una capa verificable del acuerdo sin romper el happy path.
>
> Ahora lo muestro en vivo creando un pago, viendo el registro y reclamándolo desde la wallet del cosechero.

---

## Qué NO decir para no perder tiempo

- no expliques toda Stellar desde cero
- no expliques detalles internos del SDK
- no expliques código
- no te detengas demasiado en la UI
- no hables más de 20 segundos por slide

---

## Checklist antes de grabar o presentar

- empleador en Testnet
- cosechero en Testnet
- ambas wallets fondeadas
- lock corto configurado para demo
- una operación ya probada de punta a punta
- explorer fácil de abrir
- Vercel funcionando
- env vars Soroban cargadas
- plan B listo si Freighter o Testnet fallan
