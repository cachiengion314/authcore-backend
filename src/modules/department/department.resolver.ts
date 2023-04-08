import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User } from '../../@generated/user/user.model'
import { PrismaClientManager } from '../db/client-manager.provider'
import { findManyCursorConnection } from 'src/common/prisma-relay'
import { DepartmentConnection } from './models/user-connection.model'
import { FindManyDepartmentArgs } from 'src/@generated/department/find-many-department.args'
import { FindUniqueDepartmentArgs } from 'src/@generated/department/find-unique-department.args'
import { DepartmentService } from './department.service'
import { Department } from 'src/@generated/department/department.model'
import { CreateOneDepartmentArgs } from 'src/@generated/department/create-one-department.args'
import { GqlReq } from 'src/common/decorators/req-decorator'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { UpdateOneDepartmentArgs } from 'src/@generated/department/update-one-department.args'
import { UpdateManyDepartmentArgs } from 'src/@generated/department/update-many-department.args'
import { CreateManyDepartmentArgs } from 'src/@generated/department/create-many-department.args'
import { DeleteManyDepartmentArgs } from 'src/@generated/department/delete-many-department.args'

@Resolver(() => User)
export class DepartmentResolver {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly service: DepartmentService
  ) {}

  @Query(() => DepartmentConnection)
  async departments(@Args() args: FindManyDepartmentArgs) {
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

  @Query(() => Department)
  async department(@Args() args: FindUniqueDepartmentArgs): Promise<Department> {
    return this.service.findOne(args)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Department)
  async saveDepartment(
    @GqlReq() req: any,
    @Args() args: CreateOneDepartmentArgs
  ): Promise<Department> {
    const { user } = req
    return this.service.createOne(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async saveDepartments(
    @GqlReq() req: any,
    @Args() args: CreateManyDepartmentArgs
  ): Promise<number> {
    const { user } = req
    return this.service.createMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Department)
  async updateDepartment(
    @GqlReq() req: any,
    @Args() updateOneTagArgs: UpdateOneDepartmentArgs
  ): Promise<Department> {
    const { user } = req
    return this.service.updateOne(updateOneTagArgs, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async updateDepartments(
    @GqlReq() req: any,
    @Args() args: UpdateManyDepartmentArgs
  ): Promise<number> {
    const { user } = req
    return this.service.updateMany(args, user)
  }

  @UseGuards(GqlJwtAuthGuard)
  @Mutation(() => Number)
  async deleteDepartments(
    @GqlReq() req: any,
    @Args() args: DeleteManyDepartmentArgs
  ): Promise<number> {
    return this.service.softDeletes(args)
  }
}
