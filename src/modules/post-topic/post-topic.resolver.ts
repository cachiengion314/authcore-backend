import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { PostTopicConnection } from './models/post-topic-connection.model'
import { PostTopicService } from './post-topic.service'
import { PostTopic } from 'src/@generated/post-topic/post-topic.model'
import { FindManyPostTopicArgs } from 'src/@generated/post-topic/find-many-post-topic.args'
import { FindUniquePostTopicArgs } from 'src/@generated/post-topic/find-unique-post-topic.args'
import { CreateOnePostTopicArgs } from 'src/@generated/post-topic/create-one-post-topic.args'
import { CreateManyPostTopicArgs } from 'src/@generated/post-topic/create-many-post-topic.args'
import { UpdateOnePostTopicArgs } from 'src/@generated/post-topic/update-one-post-topic.args'
import { UpdateManyPostTopicArgs } from 'src/@generated/post-topic/update-many-post-topic.args'
import { DeleteManyPostTopicArgs } from 'src/@generated/post-topic/delete-many-post-topic.args'

@Resolver(() => PostTopic)
export class PostTopicResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: PostTopicService
  ) {}

  @Query(() => PostTopicConnection)
  async postTopics(@Args() args: FindManyPostTopicArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().postTopic.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().postTopic.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => PostTopic)
  async postTopic(@Args() args: FindUniquePostTopicArgs): Promise<PostTopic> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostTopic)
  async savePostTopic(
    @GqlReq() req: any,
    @Args() args: CreateOnePostTopicArgs
  ): Promise<PostTopic> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async savePostTopics(@GqlReq() req: any, @Args() args: CreateManyPostTopicArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => PostTopic)
  async updatePostTopic(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOnePostTopicArgs
  ): Promise<PostTopic> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updatePostTopics(
    @GqlReq() req: any,
    @Args() args: UpdateManyPostTopicArgs
  ): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deletePostTopics(
    @GqlReq() req: any,
    @Args() args: DeleteManyPostTopicArgs
  ): Promise<number> {
    return this.service.softDeletes(args)
  }
}
