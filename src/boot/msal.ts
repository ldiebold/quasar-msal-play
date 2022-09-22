import { boot } from 'quasar/wrappers'
import { msalConfig } from 'src/config/msal'
import { msalPlugin, MsalPluginOptions } from 'src/shared/services/msal/msalPlugin'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.use(msalPlugin, msalConfig as MsalPluginOptions)
})
