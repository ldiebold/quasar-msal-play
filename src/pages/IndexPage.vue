<script setup lang="ts">
// Create the main msalInstance instance

import { loginRequest, msalConfig } from 'src/config/msal-backup'
import {
  PublicClientApplication,
  AuthenticationResult,
  InteractionRequiredAuthError,
  AccountInfo,
} from '@azure/msal-browser'
import { ref } from 'vue'

// configuration parameters are located at authConfig.js
const msalInstance = new PublicClientApplication(msalConfig)

const username = ref('')
const account = ref<AccountInfo | null>(null)
const token = ref<AuthenticationResult | undefined>()

function selectAccount () {
  /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

  const currentAccounts = msalInstance.getAllAccounts()
  if (currentAccounts.length === 0) {
    console.log('current accounts is 0')
  } else if (currentAccounts.length > 1) {
    // Add choose account code here
    console.warn('Multiple accounts detected.')
  } else if (currentAccounts.length === 1) {
    username.value = currentAccounts[0].username
  }
}

function handleResponse (response: AuthenticationResult) {
  if (response !== null) {
    account.value = response.account
    console.log(account.value)
    username.value = response.account?.username || ''
  } else {
    selectAccount()
  }
}

function signIn () {
  msalInstance.loginPopup(loginRequest)
    .then(handleResponse)
    .catch(error => {
      console.error(error)
    })
}

function signOut () {
  const logoutRequest = {
    account: msalInstance.getAccountByUsername(username.value),
    postLogoutRedirectUri: msalConfig.auth.redirectUri,
    mainWindowRedirectUri: msalConfig.auth.redirectUri,
  }

  msalInstance.logoutPopup(logoutRequest)
}

selectAccount()

function getDataverseData () {
  if (!token.value) {
    return
  }

  fetch('https://orgde778194.api.crm6.dynamics.com/api/data/v9.2/core_bookings', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.value.accessToken}`,
      Accepts: 'application/json',
    },
  })
}

function getTokenPopup () {
  loginRequest.account = msalInstance.getAccountByUsername(username.value)
  return msalInstance.acquireTokenSilent(loginRequest)
    .catch(error => {
      console.warn('silent token acquisition fails. acquiring token using popup')
      if (error instanceof InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return msalInstance.acquireTokenPopup(loginRequest)
          .then(tokenResponse => {
            console.log(tokenResponse)
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
</script>

<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <q-btn
        label="login"
        @click="signIn()"
      />
      <div>{{ username }}</div>

      <q-btn
        label="get dataverse data"
        @click="getDataverseData"
      />

      <q-btn
        label="get token popup"
        @click="getTokenPopup"
      />
    </div>
  </q-page>
</template>
