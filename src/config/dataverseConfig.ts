import { DataversePluginOptions } from 'services/dataverse/plugin/DataversePlugin'
import getMsalConfig from 'services/msal/getMsalConfig'
import useToken from 'services/msal/useToken'
import { ref } from 'vue'

if (!process.env.DATAVERSE_CORE_ENDPOINT) {
  throw new Error('env variable "DATAVERSE_CORE_ENDPOINT" must be defined')
}

export const msalConfig: DataversePluginOptions = {
  default: 'core',
  apis: {
    core: {
      apiEndpoint: process.env.DATAVERSE_CORE_ENDPOINT,
      scopes: ['https://orgde778194.api.crm6.dynamics.com/.default'],
      useTokenService () {
        const client = getMsalConfig()
        const account = client.configs.default.scopes

        const tokenService = useToken({
          account,
          scopes: client.configs.default.scopes,
        })
        return tokenService
      },
    },
  },
}
