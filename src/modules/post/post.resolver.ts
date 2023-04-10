import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { PostConnection } from './models/post-connection.model'
import { PostService } from './post.service'
import { Post } from 'src/@generated/post/post.model'
import { FindManyPostArgs } from 'src/@generated/post/find-many-post.args'
import { FindUniquePostArgs } from 'src/@generated/post/find-unique-post.args'
import { CreateOnePostArgs } from 'src/@generated/post/create-one-post.args'
import { CreateManyPostArgs } from 'src/@generated/post/create-many-post.args'
import { UpdateOnePostArgs } from 'src/@generated/post/update-one-post.args'
import { UpdateManyPostArgs } from 'src/@generated/post/update-many-post.args'
import { DeleteManyPostArgs } from 'src/@generated/post/delete-many-post.args'

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: PostService
  ) {}

  @Query(() => PostConnection)
  async posts(@Args() args: FindManyPostArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().post.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().post.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Post)
  async post(@Args() args: FindUniquePostArgs): Promise<Post> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Post)
  async savePost(@GqlReq() req: any, @Args() args: CreateOnePostArgs): Promise<Post> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async savePosts(@GqlReq() req: any, @Args() args: CreateManyPostArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Post)
  async updatePost(@GqlReq() req: any, @Args() updateOneTagArgs: UpdateOnePostArgs): Promise<Post> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updatePosts(@GqlReq() req: any, @Args() args: UpdateManyPostArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deletePosts(@GqlReq() req: any, @Args() args: DeleteManyPostArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
