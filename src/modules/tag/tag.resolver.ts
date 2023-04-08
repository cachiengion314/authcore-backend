import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { TagService } from './tag.service'
import { Tag } from 'src/@generated/tag/tag.model'
import { TagConnection } from './models/tag-connection.model'
import { FindManyTagArgs } from 'src/@generated/tag/find-many-tag.args'
import { FindUniqueTagArgs } from 'src/@generated/tag/find-unique-tag.args'
import { CreateOneTagArgs } from 'src/@generated/tag/create-one-tag.args'
import { CreateManyTagArgs } from 'src/@generated/tag/create-many-tag.args'
import { UpdateOneTagArgs } from 'src/@generated/tag/update-one-tag.args'
import { UpdateManyTagArgs } from 'src/@generated/tag/update-many-tag.args'
import { DeleteManyTagArgs } from 'src/@generated/tag/delete-many-tag.args'

@Resolver(() => Tag)
export class TagResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: TagService
  ) {}

  @Query(() => TagConnection)
  async tags(@Args() args: FindManyTagArgs) {
    const result = await findManyCursorConnection(
      (params) => {
        return this.prismaClientManager.getClient().tag.findMany({
          ...args,
          ...params,
        })
      },
      () =>
        this.prismaClientManager.getClient().tag.count({
          where: args.where,
        }),
      {
        skip: args.skip,
        take: args.take,
      }
    )
    return result
  }

  @Query(() => Tag)
  async tag(@Args() args: FindUniqueTagArgs): Promise<Tag> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Tag)
  async saveTag(@GqlReq() req: any, @Args() args: CreateOneTagArgs): Promise<Tag> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveTags(@GqlReq() req: any, @Args() args: CreateManyTagArgs): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Tag)
  async updateTag(@GqlReq() req: any, @Args() updateOneTagArgs: UpdateOneTagArgs): Promise<Tag> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateTopics(@GqlReq() req: any, @Args() args: UpdateManyTagArgs): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteTopics(@GqlReq() req: any, @Args() args: DeleteManyTagArgs): Promise<number> {
    return this.service.softDeletes(args)
  }
}
