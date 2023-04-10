import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { PostTagConnection } from './models/post-tag-connection.model'
import { PostTagService } from './post-tag.service'
import { FindManyPostTagArgs } from 'src/@generated/post-tag/find-many-post-tag.args'
import { PostTag } from 'src/@generated/post-tag/post-tag.model'
import { FindUniquePostTagArgs } from 'src/@generated/post-tag/find-unique-post-tag.args'
import { CreateOnePostTagArgs } from 'src/@generated/post-tag/create-one-post-tag.args'
import { CreateManyPostTagArgs } from 'src/@generated/post-tag/create-many-post-tag.args'
import { UpdateOnePostTagArgs } from 'src/@generated/post-tag/update-one-post-tag.args'
import { UpdateManyPostTagArgs } from 'src/@generated/post-tag/update-many-post-tag.args'
import { DeleteManyPostTagArgs } from 'src/@generated/post-tag/delete-many-post-tag.args'

@Resolver(() => PostTag)
export class PostTagResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: PostTagService
  ) {}

  @Query(() => PostTagConnection)
  async postTags(@Args() args: FindManyPostTagArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().postTag.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().postTag.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => PostTag)
  async postTag(@Args() args: FindUniquePostTagArgs): Promise<PostTag> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostTag)
  async savePostTag(@GqlReq() req: any, @Args() args: CreateOnePostTagArgs): Promise<PostTag> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async savePostTags(@GqlReq() req: any, @Args() args: CreateManyPostTagArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostTag)
  async updatePostTag(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOnePostTagArgs
  ): Promise<PostTag> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updatePostTags(@GqlReq() req: any, @Args() args: UpdateManyPostTagArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deletePostTags(@GqlReq() req: any, @Args() args: DeleteManyPostTagArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
