# Demo Script — CosechaPay

## Objetivo
Mostrar en 60–90 segundos que CosechaPay permite:
- bloquear un pago de cosecha antes del trabajo
- verificarlo on-chain
- reclamarlo desde la wallet del cosechero

## Preparación previa

### Wallets
- Wallet 1: **Empleador**
- Wallet 2: **Cosechero**
- Ambas en **Stellar Testnet**
- Ambas activadas y fondeadas

### App
- Levantar la app en local
- Tener abierta la home de CosechaPay
- Tener Freighter funcionando

### Fallback
- Tener una transacción ya creada por si falla internet/testnet
- Tener abierto Stellar Expert o links listos

## Guión corto de pitch

> En trabajo rural informal, muchas veces el cosechero no tiene garantía de que el pago prometido realmente exista. CosechaPay resuelve eso bloqueando el dinero antes de empezar la cosecha. El empleador inmoviliza los fondos on-chain y el cosechero los puede reclamar con visibilidad total y sin intermediarios.

## Demo paso a paso

### 1. Mostrar la home
Decir:

> Esta es la app de CosechaPay. Tenemos dos vistas prácticas: empleador, que crea pagos, y cosechero, que reclama balances disponibles.

Mostrar:
- header con wallet conectada
- sección de pagos activos
- sección de pagos reclamables

### 2. Conectarse como empleador
Decir:

> Primero entra el empleador con su wallet en Stellar Testnet.

Mostrar:
- wallet del empleador conectada
- botón **Nuevo pago**

### 3. Crear el pago
Ir a **Nuevo pago**.

Completar:
- dirección del cosechero
- monto chico, por ejemplo `0.1 XLM`
- descripción corta
- tiempo de bloqueo: 1 minuto para demo

Decir:

> El empleador define el destinatario y bloquea el monto antes de que empiece el trabajo.

### 4. Firmar en Freighter
Decir:

> La wallet firma una transacción real de Stellar. Acá no estamos simulando nada.

Mostrar si se puede:
- popup de Freighter
- operación `Create Claimable Balance`

### 5. Mostrar el pago bloqueado
Después de crear, entrar al detalle.

Decir:

> Ahora el pago quedó bloqueado on-chain. Vemos el estado, la transacción y el claimable balance ID.

Mostrar:
- estado **Bloqueado**
- TX creación
- Claimable Balance ID
- links al explorer

### 6. Cambiar a la wallet del cosechero
Volver a home y conectar la wallet del cosechero.

Decir:

> Ahora entra el cosechero. La app consulta Horizon y detecta qué balances puede reclamar esta wallet.

Mostrar:
- sección **Pagos que puedo reclamar**
- balance pendiente

### 7. Reclamar fondos
Hacer click en **Reclamar**.

Decir:

> El cosechero reclama los fondos directamente desde su wallet. El dinero ya estaba reservado desde antes.

Mostrar:
- firma en Freighter
- éxito del claim

### 8. Cerrar con prueba on-chain
Volver al detalle o abrir explorer.

Decir:

> El estado final queda verificable on-chain. Esa es la diferencia: no es una promesa verbal, es un pago reservado y trazable.

Mostrar:
- estado reclamado
- TX de reclamo si está visible
- explorer

## Versión de 30 segundos

> CosechaPay permite que un empleador bloquee un pago de cosecha antes de que empiece el trabajo. Ese dinero queda reservado en Stellar como Claimable Balance. Después, el cosechero lo reclama con su wallet y todo queda verificable on-chain.

## Qué remarcar en el pitch
- problema real y local
- blockchain usada para confianza, no decoración
- sin backend ni contrato custom para el MVP
- demo real en Stellar Testnet
- extensible a reglas más complejas en una siguiente fase

## Si algo falla en vivo

### Si falla Freighter
- mostrar una transacción ya creada
- mostrar el claimable balance ya bloqueado

### Si falla Testnet
- usar explorer con una operación ya realizada
- explicar el flujo con el estado ya persistido

### Si falla el claim en vivo
- mostrar que el balance pendiente aparece para el cosechero
- explicar que el último paso es la firma del destinatario

## Checklist final antes de presentar
- [ ] empleador en Testnet
- [ ] cosechero en Testnet
- [ ] ambas wallets fondeadas
- [ ] app local levantada
- [ ] una operación ya probada de punta a punta
- [ ] explorer abierto o fácil de abrir
- [ ] plan B listo
