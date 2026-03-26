import { describe, expect, it, vi } from 'vitest'
import { runBestEffortWorkAgreementRegistration } from './companion-registration'

describe('runBestEffortWorkAgreementRegistration', () => {
  it('persiste registro exitoso sin bloquear', async () => {
    const persist = vi.fn()

    await runBestEffortWorkAgreementRegistration({
      register: async () => ({
        status: 'registered',
        sorobanTxHash: 'soroban-hash',
        sorobanAgreementHash: 'agreement-hash',
      }),
      persist,
    })

    expect(persist).toHaveBeenCalledWith({
      sorobanRegistrationStatus: 'registered',
      sorobanTxHash: 'soroban-hash',
      sorobanAgreementHash: 'agreement-hash',
      sorobanError: undefined,
    })
  })

  it('degrada a failed y no arroja si Soroban revienta', async () => {
    const persist = vi.fn()

    await expect(
      runBestEffortWorkAgreementRegistration({
        register: async () => {
          throw new Error('rpc caido')
        },
        persist,
      })
    ).resolves.toBeUndefined()

    expect(persist).toHaveBeenCalledWith({
      sorobanRegistrationStatus: 'failed',
      sorobanError: 'rpc caido',
    })
  })
})
