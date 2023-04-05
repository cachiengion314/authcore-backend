import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { User } from '../../@generated/user/user.model'
import { GqlReq } from '../../common/decorators/req-decorator'
import { UserService } from './user.service'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args'
import { Token } from '../auth/models/token.model'
import { FindManyUserArgs } from 'src/@generated/user/find-many-user.args'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [User])
  async users(@Args() args: FindManyUserArgs, @GqlReq() req: any) {
    const { user } = req
    const { where } = args
    const { tenantId } = user

    return this.userService.findManyUsers(tenantId, where)
  }

  @Mutation(() => Token)
  async saveOneTenant(@Args() args: CreateOneUserArgs) {
    return await this.userService.createOneTenant(args)
  }
}
