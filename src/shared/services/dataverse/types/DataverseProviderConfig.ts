import { AccountInfo } from '@azure/msal-common'
import { MaybeComputedRef } from '@vueuse/shared'
import { UseTokenReturn } from 'services/msal/useToken'

export interface DataverseProviderConfig {
  apiEndpoint: string
  scopes: string[]
  useTokenService?: (options: {
    account: MaybeComputedRef<AccountInfo | undefined>
    identifier?: string | undefined,
    scopes?: MaybeComputedRef<string[]> | undefined
  }) => UseTokenReturn
  errorNotifiers?: {
    create?: (options: { entityType: string }) => void
    update?: (options: { entityType: string }) => void
    remove?: (options: { entityType: string }) => void
    fetch?: (options: { entityType: string }) => void
    fetchOne?: (options: { entityType: string }) => void
  }
}
