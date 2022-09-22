<script lang="ts" setup>
import useAuth from 'services/msal/makeUseAuth'
import { mdiClipboard } from '@quasar/extras/mdi-v7'
import { Notify, copyToClipboard } from 'quasar'
import useToken from 'services/msal/useToken'

const authService = useAuth()
const tokenService = useToken({ account: authService.selectedAccount })
</script>

<template>
  <q-page
    class="column items-center items-start q-gutter-lg"
    padding
  >
    <q-card class="card text-body1">
      <q-card-section>
        <h5 class="q-my-none">
          Sign In
        </h5>
      </q-card-section>
      <q-card-section>
        <q-btn
          label="Sign In"
          no-caps
          color="primary"
          @click="authService.signIn()"
        />
      </q-card-section>
    </q-card>

    <q-card>
      <q-list separator>
        <q-item>
          <q-item-section class="text-h5">
            Select An Account
          </q-item-section>
        </q-item>
        <q-item
          v-for="account in authService.availableAccounts.value"
          :key="account.tenantId"
          clickable
          :active="account.tenantId === authService.selectedAccount.value?.tenantId"
          @click="authService.selectAccount(account)"
        >
          <q-item-section>
            {{ account.username }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h5">
          Scopes
        </div>
      </q-card-section>
      <q-list>
        <q-item
          v-for="scope in authService.scopes.value"
          :key="scope"
        >
          <q-item-section>
            {{ scope }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h5">
          Fetch Token
        </div>
      </q-card-section>
      <q-card-section>
        <q-btn
          label="Fetch Token"
          no-caps
          color="indigo"
          :disabled="!authService.selectedAccount.value"
          @click="tokenService.getTokenPopup()"
        />
      </q-card-section>
    </q-card>

    <q-card
      class="card"
      style="max-wdith: "
    >
      <q-card-section>
        <div
          class="text-h5 row items-center"
        >
          Token
          <q-space />
          <q-btn
            v-if="tokenService.token.value?.accessToken"
            flat
            round
            color="grey-7"
            size="sms"
            :icon="mdiClipboard"
            @click="() => {
              if(tokenService.token.value?.accessToken) {
                copyToClipboard(tokenService.token.value.accessToken)
              }
              Notify.create({ message: 'copied!', color: 'positive' })
            }"
          />
        </div>

        <div style="overflow-wrap: break-word;">
          {{ tokenService.token.value?.accessToken }}
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">
.card {
  max-width: 450px
}
</style>
