import { inject } from 'vue'
import { DataverseProviderConfig } from '../types/DataverseProviderConfig'

export default function getConfig (providerKey = 'default') {
  const config = inject<DataverseProviderConfig>('dataversePiniaOrmConfig:' + providerKey)

  if (!config) {
    throw new Error('Error getting the default dataverse config. Did you install the dataverse rest plugin?')
  }

  return config
}
