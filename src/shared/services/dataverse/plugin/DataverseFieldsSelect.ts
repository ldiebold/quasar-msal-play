import { Model } from '../types/Model'

export type DataverseFieldsSelect<ModelType extends Model> = [keyof ModelType]
