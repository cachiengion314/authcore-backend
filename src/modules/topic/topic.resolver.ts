import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { TopicConnection } from './models/topic-connection.model'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { Topic } from 'src/@generated/topic/topic.model'
import { TopicService } from './topic.service'
import { FindManyTopicArgs } from 'src/@generated/topic/find-many-topic.args'
import { FindUniqueTopicArgs } from 'src/@generated/topic/find-unique-topic.args'
import { CreateOneTopicArgs } from 'src/@generated/topic/create-one-topic.args'
import { CreateManyTopicArgs } from 'src/@generated/topic/create-many-topic.args'
import { UpdateOneTopicArgs } from 'src/@generated/topic/update-one-topic.args'
import { UpdateManyTopicArgs } from 'src/@generated/topic/update-many-topic.args'
import { DeleteManyTopicArgs } from 'src/@generated/topic/delete-many-topic.args'

@Resolver(() => Topic)
export class TopicResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: TopicService
  ) {}

  @Query(() => TopicConnection)
  async topics(@Args() args: FindManyTopicArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().topic.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().topic.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Topic)
  async topic(@Args() args: FindUniqueTopicArgs): Promise<Topic> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Topic)
  async saveTopic(@GqlReq() req: any, @Args() args: CreateOneTopicArgs): Promise<Topic> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveTopics(@GqlReq() req: any, @Args() args: CreateManyTopicArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Topic)
  async updateTopic(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneTopicArgs
  ): Promise<Topic> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateTopics(@GqlReq() req: any, @Args() args: UpdateManyTopicArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteTopics(@GqlReq() req: any, @Args() args: DeleteManyTopicArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
