import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { PostIdeaConnection } from './models/post-idea-connection.model'
import { PostIdeaService } from './post-idea.service'
import { FindManyPostIdeaArgs } from 'src/@generated/post-idea/find-many-post-idea.args'
import { PostIdea } from 'src/@generated/post-idea/post-idea.model'
import { FindUniquePostIdeaArgs } from 'src/@generated/post-idea/find-unique-post-idea.args'
import { CreateOnePostIdeaArgs } from 'src/@generated/post-idea/create-one-post-idea.args'
import { CreateManyPostIdeaArgs } from 'src/@generated/post-idea/create-many-post-idea.args'
import { UpdateOnePostIdeaArgs } from 'src/@generated/post-idea/update-one-post-idea.args'
import { UpdateManyPostIdeaArgs } from 'src/@generated/post-idea/update-many-post-idea.args'
import { DeleteManyPostIdeaArgs } from 'src/@generated/post-idea/delete-many-post-idea.args'

@Resolver(() => PostIdea)
export class PostIdeaResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: PostIdeaService
  ) {}

  @Query(() => PostIdeaConnection)
  async postIdeas(@Args() args: FindManyPostIdeaArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().postIdea.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().postIdea.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => PostIdea)
  async postIdea(@Args() args: FindUniquePostIdeaArgs): Promise<PostIdea> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostIdea)
  async savePostIdea(@GqlReq() req: any, @Args() args: CreateOnePostIdeaArgs): Promise<PostIdea> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async savePostIdeas(@GqlReq() req: any, @Args() args: CreateManyPostIdeaArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostIdea)
  async updatePostIdea(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOnePostIdeaArgs
  ): Promise<PostIdea> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updatePostIdeas(@GqlReq() req: any, @Args() args: UpdateManyPostIdeaArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deletePostIdeas(@GqlReq() req: any, @Args() args: DeleteManyPostIdeaArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
