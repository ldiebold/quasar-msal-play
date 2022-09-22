import { LogLevel } from '@azure/msal-browser'

export const msalConfig = {
  auth: {
    clientId: '60010c2e-55b5-434f-8913-56073e448939', // This is the ONLY mandatory field that you need to supply.
    authority: 'https://login.microsoftonline.com/2585ab39-0884-400a-9497-376d59c8c930', // Defaults to "https://login.microsoftonline.com/common"
    redirectUri: 'http://localhost:9000', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href
    postLogoutRedirectUri: 'http://localhost:9000/worked', // Simply remove this line if you would like navigate to index page after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
    storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message)
            return
          case LogLevel.Info:
            console.info(message)
            return
          case LogLevel.Verbose:
            console.debug(message)
            return
          case LogLevel.Warning:
            console.warn(message)
        }
      },
    },
  },
}

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ['https://orgde778194.api.crm6.dynamics.com/.default'],
  // scopes: ['openid', 'profile'],
}

/**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */

// const silentRequest = {
//   scopes: ["openid", "profile"],
//   loginHint: "example@domain.net"
// };
