import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { IdeaConnection } from './models/idea-connection.model'
import { IdeaService } from './idea.service'
import { Idea } from 'src/@generated/idea/idea.model'
import { FindManyIdeaArgs } from 'src/@generated/idea/find-many-idea.args'
import { FindUniqueIdeaArgs } from 'src/@generated/idea/find-unique-idea.args'
import { CreateOneIdeaArgs } from 'src/@generated/idea/create-one-idea.args'
import { CreateManyIdeaArgs } from 'src/@generated/idea/create-many-idea.args'
import { UpdateOneIdeaArgs } from 'src/@generated/idea/update-one-idea.args'
import { UpdateManyIdeaArgs } from 'src/@generated/idea/update-many-idea.args'
import { DeleteManyIdeaArgs } from 'src/@generated/idea/delete-many-idea.args'

@Resolver(() => Idea)
export class IdeaResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: IdeaService
  ) {}

  @Query(() => IdeaConnection)
  async ideas(@Args() args: FindManyIdeaArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().idea.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().idea.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Idea)
  async idea(@Args() args: FindUniqueIdeaArgs): Promise<Idea> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Idea)
  async saveIdea(@GqlReq() req: any, @Args() args: CreateOneIdeaArgs): Promise<Idea> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveIdeas(@GqlReq() req: any, @Args() args: CreateManyIdeaArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Idea)
  async updateIdea(@GqlReq() req: any, @Args() updateOneTagArgs: UpdateOneIdeaArgs): Promise<Idea> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateIdeas(@GqlReq() req: any, @Args() args: UpdateManyIdeaArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteIdeas(@GqlReq() req: any, @Args() args: DeleteManyIdeaArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
