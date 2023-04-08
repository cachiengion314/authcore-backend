import { Injectable } from '@nestjs/common'
import { PrismaClientManager } from '../db/client-manager.provider'
import { UserWhereInput } from 'src/@generated/user/user-where.input'

@Injectable()
export class UserIndustryService {
  constructor(private readonly prismaClientManager: PrismaClientManager) {}

  findManyUsers(where: UserWhereInput) {
    return this.prismaClientManager.getClient().userIndustry.findMany({
      where,
    })
  }
}
