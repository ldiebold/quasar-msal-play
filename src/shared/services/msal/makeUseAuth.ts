import { AccountInfo } from '@azure/msal-common'
import { computed, ComputedRef, Ref, ref } from 'vue'
import getMsalClient from './getMsalClient'
import getMsalConfig from './getMsalConfig'
import { createGlobalState, MaybeComputedRef, resolveRef } from '@vueuse/core'
import useToken from './useToken'

const defaultOptions = {
  immediateTokenFetch: true,
}

export interface UseAuthReturn {
  signIn: () => void
  signOut: () => void
  hasMultipleAccounts: ComputedRef<boolean>
  availableAccounts: Ref<AccountInfo[]>
  selectAccount: (username: string | AccountInfo) => void
  selectedAccount: Ref<AccountInfo | undefined>
  scopes: ComputedRef<string[]>
}

export default function makeUseAuth (options: {
  identifier?: string
  scopes?: MaybeComputedRef<string[]>
  immediateTokenFetch?: boolean
} = {}) {
  return createGlobalState(() => {
    const msalGlobalConfig = getMsalConfig()
    const identifier = options?.identifier || msalGlobalConfig.default
    const instanceConfig = msalGlobalConfig.configs[identifier]
    const immediateTokenFetch = options.immediateTokenFetch || defaultOptions.immediateTokenFetch

    const client = getMsalClient(identifier)
    const scopes = resolveRef<string[]>(options?.scopes || instanceConfig.scopes)

    const availableAccounts = ref<AccountInfo[]>(client.getAllAccounts())
    const hasMultipleAccounts = computed(() => availableAccounts.value.length > 1)
    const selectedAccount = ref<AccountInfo>()

    if (availableAccounts.value.length === 1) {
      selectAccount(availableAccounts.value[0])
    }

    const username = computed(() => selectedAccount.value?.username)

    const tokenService = useToken({
      identifier,
      account: selectedAccount,
      scopes,
    })

    function selectAccount (username: string | AccountInfo) {
      const account = availableAccounts.value.find(currentAccount => {
        const usernameString = typeof username === 'string' ? username : username.username
        return currentAccount.username === usernameString
      })

      if (!account) {
        throw new Error('could not select account, as it does not exist in the all accounts list.')
      }

      selectedAccount.value = account
    }

    function handleSignInError () {
      return ''
    }

    function handleSignInSuccess () {
      availableAccounts.value = client.getAllAccounts()

      if (availableAccounts.value.length === 1) {
        selectedAccount.value = availableAccounts.value[0]
      }
    }

    function signIn () {
      client.loginPopup({ scopes: scopes.value })
        .then(handleSignInSuccess)
        .catch(handleSignInError)
    }

    function signOut () {
      if (!username.value) {
        throw new Error('cannot logout: username not found. is a user currently logged in, and has an account been selected?')
      }

      const logoutRequest = {
        account: client.getAccountByUsername(username.value),
        postLogoutRedirectUri: instanceConfig.publicClientConfig.auth.postLogoutRedirectUri,
        mainWindowRedirectUri: instanceConfig.publicClientConfig.auth.redirectUri,
      }

      client.logoutPopup(logoutRequest)
    }

    if (immediateTokenFetch) {
      tokenService.getTokenPopup()
    }

    return {
      signIn,
      signOut,
      hasMultipleAccounts,
      availableAccounts,
      selectAccount,
      selectedAccount,
      scopes,
    }
  })
}
