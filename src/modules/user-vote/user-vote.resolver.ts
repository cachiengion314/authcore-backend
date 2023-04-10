import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { UserVoteConnection } from './models/user-vote-connection.model'
import { UserVoteService } from './user-vote.service'
import { UserVote } from 'src/@generated/user-vote/user-vote.model'
import { FindManyUserVoteArgs } from 'src/@generated/user-vote/find-many-user-vote.args'
import { FindUniqueUserVoteArgs } from 'src/@generated/user-vote/find-unique-user-vote.args'
import { CreateOneUserVoteArgs } from 'src/@generated/user-vote/create-one-user-vote.args'
import { UpdateOneUserVoteArgs } from 'src/@generated/user-vote/update-one-user-vote.args'
import { UpdateManyUserVoteArgs } from 'src/@generated/user-vote/update-many-user-vote.args'
import { DeleteManyUserVoteArgs } from 'src/@generated/user-vote/delete-many-user-vote.args'
import { CreateManyUserVoteArgs } from 'src/@generated/user-vote/create-many-user-vote.args'

@Resolver(() => UserVote)
export class UserVoteResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: UserVoteService
  ) {}

  @Query(() => UserVoteConnection)
  async userVotes(@Args() args: FindManyUserVoteArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().userVote.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().userVote.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => UserVote)
  async userVote(@Args() args: FindUniqueUserVoteArgs): Promise<UserVote> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserVote)
  async saveUserVote(@GqlReq() req: any, @Args() args: CreateOneUserVoteArgs): Promise<UserVote> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveUserVotes(@GqlReq() req: any, @Args() args: CreateManyUserVoteArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => UserVote)
  async updateUserVote(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneUserVoteArgs
  ): Promise<UserVote> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateUserVotes(@GqlReq() req: any, @Args() args: UpdateManyUserVoteArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteUserVotes(@GqlReq() req: any, @Args() args: DeleteManyUserVoteArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
