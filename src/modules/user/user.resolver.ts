import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { User } from '../../@generated/user/user.model'
import { GqlReq } from '../../common/decorators/req-decorator'
import { FindManyUsersWithTenantIdArgs } from './args'
import { UserService } from './user.service'
import { UseGuards } from '@nestjs/common'
import { GqlJwtAuthGuard } from '../auth/gql-auth.guard'
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlJwtAuthGuard)
  @Query(() => [User])
  async users(@Args() args: FindManyUsersWithTenantIdArgs, @GqlReq() req: any) {
    const { user } = req
    console.log(`user`, user)
    const { tenantId } = args

    return this.userService.findAll(tenantId)
  }

  @Mutation(() => Number)
  async saveOneTenant(@Args() args: CreateOneUserArgs) {
    return await this.userService.createOneTenant(args)
  }
}
