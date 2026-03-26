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
