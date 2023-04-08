import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { IndustryConnection } from './models/industry-connection.model'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { IndustryService } from './industry.service'
import { FindManyIndustryArgs } from 'src/@generated/industry/find-many-industry.args'
import { FindUniqueIndustryArgs } from 'src/@generated/industry/find-unique-industry.args'
import { Industry } from 'src/@generated/industry/industry.model'
import { CreateOneIndustryArgs } from 'src/@generated/industry/create-one-industry.args'
import { CreateManyIndustryArgs } from 'src/@generated/industry/create-many-industry.args'
import { UpdateOneIndustryArgs } from 'src/@generated/industry/update-one-industry.args'
import { UpdateManyIndustryArgs } from 'src/@generated/industry/update-many-industry.args'
import { DeleteManyIndustryArgs } from 'src/@generated/industry/delete-many-industry.args'

@Resolver(() => Industry)
export class IndustryResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: IndustryService
  ) {}

  @Query(() => IndustryConnection)
  async industries(@Args() args: FindManyIndustryArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().department.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().department.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Industry)
  async industry(@Args() args: FindUniqueIndustryArgs): Promise<Industry> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Industry)
  async saveIndustry(@GqlReq() req: any, @Args() args: CreateOneIndustryArgs): Promise<Industry> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveIndustries(@GqlReq() req: any, @Args() args: CreateManyIndustryArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Industry)
  async updateIndustry(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneIndustryArgs
  ): Promise<Industry> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateIndustries(
    @GqlReq() req: any,
    @Args() args: UpdateManyIndustryArgs
  ): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteIndustries(
    @GqlReq() req: any,
    @Args() args: DeleteManyIndustryArgs
  ): Promise<number> {
    return this.service.softDeletes(args)
  }
}
