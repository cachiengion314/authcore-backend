import { Prisma } from '@prisma/client'

function softDeleteMiddleware(params: Prisma.MiddlewareParams) {
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    // Change to findFirst - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'findFirst'
    // Add 'deleted' filter
    // ID filter maintained
    if (!params.args.where) {
      params.args['where'] = {}
    }
    params.args.where['deletedAt'] = null
  }
  if (params.action === 'findMany') {
    if (!params.args.where) {
      params.args['where'] = { deletedAt: null }
    }
    if (params.args.where.deleted == undefined) {
      // Exclude deleted records if they have not been explicitly requested
      params.args.where['deletedAt'] = null
    }
  }

  if (params.action == 'update') {
    // Change to updateMany - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'updateMany'
    // Add 'deleted' filter
    // ID filter maintained
    params.args.where['deletedAt'] = null
  }
  if (params.action == 'updateMany') {
    if (!params.args.where) {
      params.args['where'] = { deletedAt: null }
    }
    params.args.where['deletedAt'] = null
  }
}

export async function useMediator(
  params: Prisma.MiddlewareParams,
  next: (params: Prisma.MiddlewareParams) => Promise<any>
) {
  softDeleteMiddleware(params)

  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  console.log(
    `-------------------- Prisma Query ${params.model}.${params.action} took ${
      after - before
    }ms --------------------`
  )

  return result
}
