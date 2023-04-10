import { Injectable } from '@nestjs/common'
import { PrismaClientManager } from '../db/client-manager.provider'
import { UserWhereInput } from 'src/@generated/user/user-where.input'
import { BaseService } from 'src/common/modules/base.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserIndustryService extends BaseService {
  constructor(private readonly prismaClientManager: PrismaClientManager) {
    super(Prisma.ModelName.UserIndustry, prismaClientManager)
  }

  findManyUsers(where: UserWhereInput) {
    return this.prismaClientManager.getClient().userIndustry.findMany({
      where,
    })
  }
}
