import { Prisma } from '@prisma/client'

export type EntityRelationField = {
  createdBy?: any
  updatedBy?: any
}

export type ArgsWithEntityNameProp<T> = {
  entityName: Prisma.ModelName
  query?: T
}

export type DeleteEntityArgs = {
  where?: any
}

export type FindManyEntityArgs = {
  where?: any
  orderBy?: Array<any>
  cursor?: any
  take?: number
  skip?: number
  distinct?: Array<any>
  include?: EntityRelationField
}

export type UpdateEntityArgs = {
  select?: any
  include?: any
  where?: any
  data: any
}

export type CreateManyEntityArgs = {
  data: Array<any>
  skipDuplicates?: boolean
}

export type CreateOneEntityArgs = {
  data: any
}

export type FindOneEntityArgs = {
  where?: any
  include?: EntityRelationField
}
