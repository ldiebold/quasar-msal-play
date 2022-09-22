import { PublicClientApplication } from '@azure/msal-browser'
import { inject } from 'vue'
import getMsalConfig from './getMsalConfig'

export default function getMsalClient (identifier?: string) {
  identifier = identifier || getMsalConfig().default

  const injectKey = `msal:config:${identifier}`

  const client = inject<PublicClientApplication>(injectKey)

  if (!client) {
    throw new Error(`could not import client using key ${injectKey}`)
  }

  return client
}
