import { BASE_FEE, Contract, TransactionBuilder, xdr } from '@stellar/stellar-sdk'
import { STELLAR_NETWORK, txExplorerUrl } from '@/lib/stellar/client'
import type { PaymentRecord, SorobanRegistrationStatus } from '@/types/payment'
import type { WalletAdapter } from '@/lib/wallet/freighter-adapter'
import { getSorobanCompanionConfig, getSorobanRpcServer } from './client'

const POLL_ATTEMPTS = 8
const POLL_INTERVAL_MS = 1200

type FinalSorobanRegistrationStatus = Exclude<SorobanRegistrationStatus, 'pending'>

export interface RegisterWorkAgreementResult {
  status: FinalSorobanRegistrationStatus
  sorobanTxHash?: string
  sorobanAgreementHash?: string
  sorobanError?: string
}

interface RegisterWorkAgreementParams {
  payment: PaymentRecord
  wallet: WalletAdapter
}

interface HashableAgreement {
  claimableBalanceId: string
  employerAddress: string
  claimantAddress: string
  amount: string
  asset: string
  description?: string
  createdAt: string
  releaseDelaySeconds: number
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    globalThis.setTimeout(resolve, ms)
  })
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function serializeAgreement(agreement: HashableAgreement): string {
  return JSON.stringify({
    claimableBalanceId: agreement.claimableBalanceId,
    employerAddress: agreement.employerAddress,
    claimantAddress: agreement.claimantAddress,
    amount: agreement.amount,
    asset: agreement.asset,
    description: agreement.description ?? '',
    createdAt: agreement.createdAt,
    releaseDelaySeconds: agreement.releaseDelaySeconds,
  })
}

export async function buildWorkAgreementHash(agreement: HashableAgreement): Promise<string> {
  const payload = new TextEncoder().encode(serializeAgreement(agreement))
  const digest = await crypto.subtle.digest('SHA-256', payload)
  return toHex(digest)
}

async function waitForFinalStatus(
  server: ReturnType<typeof getSorobanRpcServer>,
  hash: string
): Promise<FinalSorobanRegistrationStatus> {
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const response = await server.getTransaction(hash)

    if (response.status === 'SUCCESS') return 'registered'
    if (response.status === 'FAILED') return 'failed'

    await sleep(POLL_INTERVAL_MS)
  }

  return 'submitted'
}

export async function registerWorkAgreement({
  payment,
  wallet,
}: RegisterWorkAgreementParams): Promise<RegisterWorkAgreementResult> {
  const { contractId } = getSorobanCompanionConfig()

  if (!contractId) {
    return {
      status: 'disabled',
    }
  }

  if (!payment.claimableBalanceId) {
    return {
      status: 'failed',
      sorobanError: 'No se pudo derivar el Claimable Balance ID para registrar el acuerdo.',
    }
  }

  const agreementHash = await buildWorkAgreementHash({
    claimableBalanceId: payment.claimableBalanceId,
    employerAddress: payment.employerAddress,
    claimantAddress: payment.claimantAddress,
    amount: payment.amount,
    asset: payment.asset,
    description: payment.description,
    createdAt: payment.createdAt,
    releaseDelaySeconds: payment.releaseDelaySeconds,
  })

  try {
    const server = getSorobanRpcServer()
    const account = await server.getAccount(payment.employerAddress)
    const contract = new Contract(contractId)

    const tx = new TransactionBuilder(account, {
      fee: String(BASE_FEE),
      networkPassphrase: STELLAR_NETWORK,
    })
      .addOperation(
        contract.call(
          'register',
          xdr.ScVal.scvString(payment.claimableBalanceId),
          xdr.ScVal.scvString(agreementHash)
        )
      )
      .setTimeout(180)
      .build()

    const preparedTx = await server.prepareTransaction(tx)
    const signedXdr = await wallet.signXdr(preparedTx.toXDR())
    const signedTx = TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK)
    const sendResult = await server.sendTransaction(signedTx)

    if (!sendResult.hash) {
      return {
        status: 'failed',
        sorobanAgreementHash: agreementHash,
        sorobanError: 'Soroban RPC no devolvió hash de transacción.',
      }
    }

    const finalStatus = await waitForFinalStatus(server, sendResult.hash)

    return {
      status: finalStatus,
      sorobanTxHash: sendResult.hash,
      sorobanAgreementHash: agreementHash,
      sorobanError:
        finalStatus === 'failed'
          ? `La transacción Soroban falló. Revisá ${txExplorerUrl(sendResult.hash)}.`
          : undefined,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido al registrar en Soroban.'

    return {
      status: 'failed',
      sorobanAgreementHash: agreementHash,
      sorobanError: message,
    }
  }
}
