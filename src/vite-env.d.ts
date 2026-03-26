/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOROBAN_RPC_URL?: string
  readonly VITE_SOROBAN_WORK_AGREEMENT_CONTRACT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
