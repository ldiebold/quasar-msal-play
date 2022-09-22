import { boot } from 'quasar/wrappers'
import { DataversePluginOptions, DataversePlugin } from 'services/dataverse/plugin/DataversePlugin'
import { msalPlugin, MsalPluginOptions } from 'src/shared/services/msal/msalPlugin'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // app.use(DataversePlugin, dataverseConfig as DataversePluginOptions)
})
