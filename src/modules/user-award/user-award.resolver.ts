import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { UserAwardService } from './user-award.service'
import { UserAwardConnection } from './models/user-award-connection.model'
import { FindUniqueAwardArgs } from 'src/@generated/award/find-unique-award.args'
import { UserAward } from 'src/@generated/user-award/user-award.model'
import { FindManyUserAwardArgs } from 'src/@generated/user-award/find-many-user-award.args'
import { CreateOneUserAwardArgs } from 'src/@generated/user-award/create-one-user-award.args'
import { CreateManyUserAwardArgs } from 'src/@generated/user-award/create-many-user-award.args'
import { UpdateOneUserAwardArgs } from 'src/@generated/user-award/update-one-user-award.args'
import { UpdateManyUserAwardArgs } from 'src/@generated/user-award/update-many-user-award.args'
import { DeleteManyUserAwardArgs } from 'src/@generated/user-award/delete-many-user-award.args'

@Resolver(() => UserAward)
export class UserAwardResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: UserAwardService
  ) {}

  @Query(() => UserAwardConnection)
  async userAwards(@Args() args: FindManyUserAwardArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().userAward.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().userAward.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => UserAward)
  async userAward(@Args() args: FindUniqueAwardArgs): Promise<UserAward> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserAward)
  async saveUserAward(
    @GqlReq() req: any,
    @Args() args: CreateOneUserAwardArgs
  ): Promise<UserAward> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveUserAwards(@GqlReq() req: any, @Args() args: CreateManyUserAwardArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserAward)
  async updateUserAward(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneUserAwardArgs
  ): Promise<UserAward> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateUserAwards(
    @GqlReq() req: any,
    @Args() args: UpdateManyUserAwardArgs
  ): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteUserAwards(
    @GqlReq() req: any,
    @Args() args: DeleteManyUserAwardArgs
  ): Promise<number> {
    return this.service.softDeletes(args)
  }
}
