import { AccountInfo, AuthenticationResult, InteractionRequiredAuthError } from '@azure/msal-common'
import { MaybeComputedRef, resolveRef } from '@vueuse/shared'
import { ref, Ref, computed, ComputedRef } from 'vue'
import { PopupRequest, SilentRequest } from '@azure/msal-browser'
import getMsalClient from './getMsalClient'
import getMsalConfig from './getMsalConfig'

export interface UseTokenReturn {
  scopes: MaybeComputedRef<string[]>
  token: Ref<AuthenticationResult | undefined>
  getTokenPopup: () => Promise<void>
  accessToken: ComputedRef<string | undefined>
}

export default function useToken (options: {
  account: MaybeComputedRef<AccountInfo | undefined>
  identifier?: string
  scopes?: MaybeComputedRef<string[]>
}): UseTokenReturn {
  const scopes = resolveRef<string[]>(options.scopes || [])
  const account = resolveRef(options.account)
  const msalGlobalConfig = getMsalConfig()
  const identifier = options?.identifier || msalGlobalConfig.default

  const client = getMsalClient(identifier)
  const token = ref<AuthenticationResult>()

  const accessToken = computed(() => token.value?.accessToken)

  async function getTokenPopup () {
    if (!account.value) {
      throw new Error(`cannot attempt to fetch token. Account is ${account.value}`)
    }

    const silentRequest: SilentRequest = {
      account: account.value,
      scopes: scopes.value,
    }

    const popupRequest: PopupRequest = {
      scopes: scopes.value,
      account: account.value,
    }

    return client.acquireTokenSilent(silentRequest)
      .catch(error => {
        console.warn('silent token acquisition fails. acquiring token using popup')
        if (error instanceof InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return client.acquireTokenPopup(popupRequest)
            .then(tokenResponse => {
              return tokenResponse
            }).catch(error => {
              console.error(error)
            })
        } else {
          console.warn(error)
        }
      }).then(tokenResponse => {
        token.value = tokenResponse || undefined
      })
  }

  return {
    scopes,
    token,
    getTokenPopup,
    accessToken,
  }
}
