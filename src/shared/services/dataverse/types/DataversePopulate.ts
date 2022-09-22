import { Model } from './Model'
import { DataverseFilterRelated } from './DataverseFilters'

export type DataversePopulateArray<ModelType extends Model> = [keyof ModelType]

export type DataversePopulateEntry = Partial<{
  // at this point the relationship key is unknown, so any string
  [key: string]: {
    populate?: string[] | DataversePopulateEntry
    sort?: string[]
    filters?: DataverseFilterRelated
    fields?: string[]
    count?: boolean
  } | '*'
}>

export type RootDataversePopulateEntry<ModelType extends Model> = Partial<{
  // must have a model key
  [Property in keyof ModelType]: {
    populate?: string[] | DataversePopulateEntry
    sort?: string[]
    filters?: DataverseFilterRelated
    fields?: string[]
    count?: boolean
  }
}>

export type DataversePopulate<ModelType extends Model> =
  DataversePopulateArray<ModelType>
  | RootDataversePopulateEntry<ModelType>
