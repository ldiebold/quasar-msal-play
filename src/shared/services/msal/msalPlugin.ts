import { Configuration, PublicClientApplication } from '@azure/msal-browser'
import { LogLevel } from '@azure/msal-common'
import { createGlobalState } from '@vueuse/shared'
import { App } from 'vue'
import { msalConfigInjectionKey } from './getMsalConfig'
import makeUseAuth from './makeUseAuth'

export interface MsalInstanceConfig {
  scopes: string[]

  publicClientConfig: Configuration,

  loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => void
}

export interface MsalPluginOptions {
  default: string
  configs: Record<string, MsalInstanceConfig>
}

function registerMsalInstance (
  app: App,
  identifier: string,
  config: MsalInstanceConfig,
) {
  const provideKey = `msal:config:${identifier}`
  const msalInstance = new PublicClientApplication(config.publicClientConfig)
  app.provide(provideKey, msalInstance)
}

function registerAuthComposable (
  app: App,
  identifier: string,
  config: MsalInstanceConfig,
) {
  const provideKey = `msal:state:${identifier}`
  const authComposable = makeUseAuth({
    identifier,
    scopes: config.scopes,
  })
  app.provide(provideKey, authComposable)
}

export const msalPlugin = {
  install: (app: App, options: MsalPluginOptions) => {
    Object.entries(options.configs)
      .forEach(([identifier, instanceConfig]) => {
        registerMsalInstance(app, identifier, instanceConfig)
      })
    app.provide(msalConfigInjectionKey, options)
  },
}
