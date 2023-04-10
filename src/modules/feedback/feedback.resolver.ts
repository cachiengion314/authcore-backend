import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { FeedbackConnection } from './models/feedback-connection.model'
import { FeedbackService } from './feedback.service'
import { FindManyFeedbackArgs } from 'src/@generated/feedback/find-many-feedback.args'
import { Feedback } from 'src/@generated/feedback/feedback.model'
import { FindUniqueFeedbackArgs } from 'src/@generated/feedback/find-unique-feedback.args'
import { CreateOneFeedbackArgs } from 'src/@generated/feedback/create-one-feedback.args'
import { CreateManyFeedbackArgs } from 'src/@generated/feedback/create-many-feedback.args'
import { UpdateOneFeedbackArgs } from 'src/@generated/feedback/update-one-feedback.args'
import { UpdateManyFeedbackArgs } from 'src/@generated/feedback/update-many-feedback.args'
import { DeleteManyFeedbackArgs } from 'src/@generated/feedback/delete-many-feedback.args'

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: FeedbackService
  ) {}

  @Query(() => FeedbackConnection)
  async feedbacks(@Args() args: FindManyFeedbackArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().feedback.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().feedback.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Feedback)
  async feedback(@Args() args: FindUniqueFeedbackArgs): Promise<Feedback> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Feedback)
  async saveFeedback(@GqlReq() req: any, @Args() args: CreateOneFeedbackArgs): Promise<Feedback> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveFeedbacks(@GqlReq() req: any, @Args() args: CreateManyFeedbackArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Feedback)
  async updateFeedback(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneFeedbackArgs
  ): Promise<Feedback> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateFeedbacks(@GqlReq() req: any, @Args() args: UpdateManyFeedbackArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteFeedbacks(@GqlReq() req: any, @Args() args: DeleteManyFeedbackArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
