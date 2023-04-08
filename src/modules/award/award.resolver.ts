import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { AwardService } from './award.service'
import { AwardConnection } from './models/award-connection.model'
import { Award } from 'src/@generated/award/award.model'
import { FindManyAwardArgs } from 'src/@generated/award/find-many-award.args'
import { FindUniqueAwardArgs } from 'src/@generated/award/find-unique-award.args'
import { CreateOneAwardArgs } from 'src/@generated/award/create-one-award.args'
import { CreateManyAwardArgs } from 'src/@generated/award/create-many-award.args'
import { UpdateOneAwardArgs } from 'src/@generated/award/update-one-award.args'
import { UpdateManyAwardArgs } from 'src/@generated/award/update-many-award.args'
import { DeleteManyAwardArgs } from 'src/@generated/award/delete-many-award.args'

@Resolver(() => Award)
export class AwardResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: AwardService
  ) {}

  @Query(() => AwardConnection)
  async awards(@Args() args: FindManyAwardArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().award.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().award.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Award)
  async award(@Args() args: FindUniqueAwardArgs): Promise<Award> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Award)
  async saveAward(@GqlReq() req: any, @Args() args: CreateOneAwardArgs): Promise<Award> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveAwards(@GqlReq() req: any, @Args() args: CreateManyAwardArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Award)
  async updateAward(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneAwardArgs
  ): Promise<Award> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateAwards(@GqlReq() req: any, @Args() args: UpdateManyAwardArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteAwards(@GqlReq() req: any, @Args() args: DeleteManyAwardArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
