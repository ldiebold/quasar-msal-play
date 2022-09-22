import { MsalPluginOptions } from 'services/msal/msalPlugin'
import standardLogger from 'services/msal/utils/standardLogger'

export const msalConfig: MsalPluginOptions = {
  default: 'default',
  configs: {
    default: {
      publicClientConfig: {
        auth: {
          clientId: '60010c2e-55b5-434f-8913-56073e448939',
          authority: 'https://login.microsoftonline.com/2585ab39-0884-400a-9497-376d59c8c930',
          redirectUri: 'http://localhost:9000',
          postLogoutRedirectUri: 'http://localhost:9000/worked',
          navigateToLoginRequestUrl: false,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      },
      scopes: ['https://orgde778194.api.crm6.dynamics.com/.default'],
      loggerCallback: standardLogger,
    },
  },
}
