import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { UserIndustryConnection } from './models/user-industry-connection.model'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { FindManyUserIndustryArgs } from 'src/@generated/user-industry/find-many-user-industry.args'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UserIndustryService } from './user-industry.service'
import { UserIndustry } from 'src/@generated/user-industry/user-industry.model'
import { FindUniqueUserIndustryArgs } from 'src/@generated/user-industry/find-unique-user-industry.args'
import { CreateOneUserIndustryArgs } from 'src/@generated/user-industry/create-one-user-industry.args'
import { CreateManyUserIndustryArgs } from 'src/@generated/user-industry/create-many-user-industry.args'
import { UpdateOneUserIndustryArgs } from 'src/@generated/user-industry/update-one-user-industry.args'
import { UpdateManyUserIndustryArgs } from 'src/@generated/user-industry/update-many-user-industry.args'
import { DeleteManyUserIndustryArgs } from 'src/@generated/user-industry/delete-many-user-industry.args'

@Resolver(() => UserIndustry)
export class UserIndustryResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: UserIndustryService
  ) {}

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
        this.prismaClientManager.getClient().userIndustry.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => UserIndustry)
  async userIndustry(@Args() args: FindUniqueUserIndustryArgs): Promise<UserIndustry> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserIndustry)
  async saveUserIndustry(
    @GqlReq() req: any,
    @Args() args: CreateOneUserIndustryArgs
  ): Promise<UserIndustry> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveUserIndustries(
    @GqlReq() req: any,
    @Args() args: CreateManyUserIndustryArgs
  ): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserIndustry)
  async updateUserIndustry(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneUserIndustryArgs
  ): Promise<UserIndustry> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateUserIndustries(
    @GqlReq() req: any,
    @Args() args: UpdateManyUserIndustryArgs
  ): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteUserIndustries(
    @GqlReq() req: any,
    @Args() args: DeleteManyUserIndustryArgs
  ): Promise<number> {
    return this.service.softDeletes(args)
  }
}
