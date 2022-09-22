import { App } from 'vue'
import { DataverseProviderConfig } from '../types/DataverseProviderConfig'

export interface DataversePluginOptions {
  default: string
  apis: Record<string, DataverseProviderConfig>
}

export const DataversePlugin = {
  install: (app: App, options: DataversePluginOptions): void => {
    Object.entries(options.apis)
      .forEach(([providerKey, providerConfig]: [string, DataverseProviderConfig]) => {
        app.provide('dataverse:' + providerKey, providerConfig)
      })
  },
}
