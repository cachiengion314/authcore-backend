import { Args, Query, Resolver } from '@nestjs/graphql'
import { User } from '../../@generated/user/user.model'
import { PrismaClientManager } from '../db/client-manager.provider'
import { UserIndustryConnection } from './models/user-connection.model'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { FindManyUserIndustryArgs } from 'src/@generated/user-industry/find-many-user-industry.args'

@Resolver(() => User)
export class UserIndustryResolver {
  constructor(private readonly prismaClientManager: PrismaClientManager) {}

  @Query(() => UserIndustryConnection)
  async userIndustrys(@Args() args: FindManyUserIndustryArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().userIndustry.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().user.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }
}
