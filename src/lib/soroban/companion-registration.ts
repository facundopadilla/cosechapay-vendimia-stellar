import type { SorobanRegistrationStatus } from '@/types/payment'
import type { RegisterWorkAgreementResult } from './register-work-agreement'

interface RegistrationPatch {
  sorobanRegistrationStatus: SorobanRegistrationStatus
  sorobanTxHash?: string
  sorobanAgreementHash?: string
  sorobanError?: string
}

interface RunBestEffortRegistrationParams {
  register: () => Promise<RegisterWorkAgreementResult>
  persist: (patch: RegistrationPatch) => void
  onSettled?: () => void | Promise<void>
}

export async function runBestEffortWorkAgreementRegistration({
  register,
  persist,
  onSettled,
}: RunBestEffortRegistrationParams): Promise<void> {
  try {
    const result = await register()

    persist({
      sorobanRegistrationStatus: result.status,
      sorobanTxHash: result.sorobanTxHash,
      sorobanAgreementHash: result.sorobanAgreementHash,
      sorobanError: result.sorobanError,
    })
  } catch (error) {
    persist({
      sorobanRegistrationStatus: 'failed',
      sorobanError:
        error instanceof Error
          ? error.message
          : 'Falló el registro Soroban, pero el escrow principal ya quedó creado.',
    })
  } finally {
    await onSettled?.()
  }
}
