import { Prisma } from '@prisma/client'
import { throwBadRequestException } from 'src/common/utility/exception'
import { PrismaClientManager } from 'src/modules/db/client-manager.provider'

export class BaseService {
  readonly entityName: Prisma.ModelName
  private readonly _prismaClientManager: PrismaClientManager

  constructor(entityName: Prisma.ModelName, prismaClientManager: PrismaClientManager) {
    this.entityName = entityName
    this._prismaClientManager = prismaClientManager
  }

  findMany(args) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    return model.findMany(args)
  }

  findOne(args) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    return model.findUnique(args)
  }

  createOne(args, user) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    const _args = {
      ...args,
      data: {
        ...args.data,
        createdBy: { connect: { id: user.id } },
        updatedBy: { connect: { id: user.id } },
      },
    }
    return model.create(_args)
  }

  async createMany(createArgs, user) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    const _createArgs = {
      ...createArgs,
      data: createArgs.data.map((elt) => ({
        ...elt,
        createdById: user.id,
        updatedById: user.id,
      })),
    }

    const { count } = await model.createMany(_createArgs)
    return count
  }

  async updateOne(args, user) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    const _args = {
      ...args,
      data: {
        ...args.data,
        updatedById: { set: user.id },
      },
    }
    let count = await model.update(_args)
    if (!count) {
      throwBadRequestException('update fail')
    }
    let _where = {}
    for (let key in args.where) {
      _where[key] = args.where[key]
    }
    const found = await model.findFirst({ where: _where })
    if (!found) {
      throwBadRequestException('Cannot found any record')
    }
    return found
  }

  async updateMany(updateArgs, user) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    const _updateArgs = {
      ...updateArgs,
      data: {
        ...updateArgs.data,
        updatedById: { set: user.id },
      },
    }
    const { count } = await model.updateMany(_updateArgs)
    return count
  }

  /**
   * @description
   * unlike softDeletes where records still remain, this method will actually delete records in database
   */
  async terminateMany(deleteManyArgs) {
    const model = this._getModelFrom(this.entityName)
    if (!model) {
      throw new Error('model not found')
    }

    const { count } = await model.deleteMany(deleteManyArgs)
    return count
  }

  async softDeletes(args): Promise<number> {
    try {
      const model = this._getModelFrom(this.entityName)
      if (!model) {
        throw new Error('model not found')
      }

      const result: Prisma.BatchPayload = await model.updateMany({
        ...args,
        data: {
          deletedAt: new Date(),
        },
      })
      return result.count
    } catch (err) {
      throwBadRequestException(err)
    }
  }

  private _getModelFrom(entityName: Prisma.ModelName) {
    let _prismaModelName: string
    if (entityName) {
      _prismaModelName = entityName[0].toLowerCase() + entityName.slice(1)
    }
    if (!_prismaModelName || !this._prismaClientManager.getClient()[_prismaModelName]) {
      return null
    }
    return this._prismaClientManager.getClient()[_prismaModelName]
  }
}
