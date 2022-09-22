import { inject } from 'vue'
import { MsalPluginOptions } from './msalPlugin'

export const msalConfigInjectionKey = 'msal:config'

export default function getMsalConfig () {
  const config = inject<MsalPluginOptions>(msalConfigInjectionKey)
  if (!config) {
    throw new Error('could not inject the msal plugin')
  }

  return config
}
