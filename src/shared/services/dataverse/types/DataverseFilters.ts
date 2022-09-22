import { Model } from './Model'

type FieldValue = string | number | null

export type DataverseFilterOperator = '$eq' |
    '$ne' |
    '$lt' |
    '$lte' |
    '$gt' |
    '$gte' |
    '$in' |
    '$notIn' |
    '$contains' |
    '$notContains' |
    '$containsi' |
    '$notContainsi' |
    '$null' |
    '$notNull' |
    '$between' |
    '$startsWith' |
    '$endsWith' |
    '$or' |
    '$and'

export type DataverseFilterOperatorObject = Record<'$eq', FieldValue | boolean>
  | Record<'$ne', FieldValue>
  | Record<'$lt', number>
  | Record<'$lte', number>
  | Record<'$gt', number>
  | Record<'$gte', number>
  | Record<'$in', FieldValue[]>
  | Record<'$notIn', FieldValue[]>
  | Record<'$contains', FieldValue>
  | Record<'$notContains', FieldValue>
  | Record<'$containsi', FieldValue>
  | Record<'$notContainsi', FieldValue>
  | Record<'$null', boolean>
  | Record<'$notNull', boolean>
  | Record<'$between', [string, string] | [number, number]>
  | Record<'$startsWith', string>
  | Record<'$endsWith', string>

export type DataverseOrFilter = Record<'$or', Record<string, DataverseFilterOperatorObject>[]>
export type DataverseAndFilter = Record<'$and', Record<string, DataverseFilterOperatorObject>[]>

// | Partial<{ [Property in keyof ModelType]: DataverseFilter | { [key: string]: DataverseFilter } }>

export type DataverseFilterRelated = Partial<{
  // must have a model key
  [key: string]:
    // Basic filter (like $eq)
    DataverseFilterOperatorObject |
    //
    DataverseFilterRelated
}>

type RootDataverseFilterObject<ModelType extends Model> = Partial<{
  // must have a model key
  [Property in keyof ModelType]:
    // Basic filter (like $eq)
    DataverseFilterOperatorObject |
    //
    DataverseFilterRelated
}>

export type DataverseFiltersObject<ModelType extends Model> =
  | Record<'$or', RootDataverseFilterObject<ModelType>[]>
  | Record<'$and', RootDataverseFilterObject<ModelType>[]>
  | RootDataverseFilterObject<ModelType>
