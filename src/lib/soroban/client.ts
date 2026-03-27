import { rpc } from '@stellar/stellar-sdk'

const DEFAULT_SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org'

export interface SorobanCompanionConfig {
  rpcUrl: string
  contractId: string | null
}

export function getSorobanCompanionConfig(): SorobanCompanionConfig {
  const rpcUrl = import.meta.env.VITE_SOROBAN_RPC_URL?.trim() || DEFAULT_SOROBAN_RPC_URL
  const contractId = import.meta.env.VITE_SOROBAN_WORK_AGREEMENT_CONTRACT_ID?.trim() || null

  return {
    rpcUrl,
    contractId,
  }
}

export function isSorobanCompanionEnabled(): boolean {
  return Boolean(getSorobanCompanionConfig().contractId)
}

export function getSorobanRpcServer() {
  const { rpcUrl } = getSorobanCompanionConfig()

  return new rpc.Server(rpcUrl, {
    allowHttp: rpcUrl.startsWith('http://'),
  })
}

interface SorobanJsonRpcSuccess<T> {
  result: T
}

interface SorobanJsonRpcFailure {
  error: {
    code: number
    message: string
  }
}

export interface RawSorobanTransactionResponse {
  status: string
  txHash: string
}

export async function getSorobanTransactionStatus(hash: string): Promise<string> {
  const { rpcUrl } = getSorobanCompanionConfig()

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: hash,
      method: 'getTransaction',
      params: {
        hash,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Soroban RPC devolvió ${response.status} al consultar la transacción.`)
  }

  const payload = (await response.json()) as
    | SorobanJsonRpcSuccess<RawSorobanTransactionResponse>
    | SorobanJsonRpcFailure

  if ('error' in payload) {
    throw new Error(payload.error.message)
  }

  return payload.result.status
}
