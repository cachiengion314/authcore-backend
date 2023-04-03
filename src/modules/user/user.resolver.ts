import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { User } from '../../@generated/user/user.model'
import { GqlReq } from '../../common/decorators/req-decorator'
import { ChooseOrganizationsArgs, FindManyUsersWithTenantIdArgs } from './args'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { UserService } from './user.service'

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @InjectQueue('REGISTER_QUEUE_CHANGE_DB_URL')
    private readonly changeUrlQueue: Queue
  ) {}

  @Query(() => [User])
  async users(@Args() args: FindManyUsersWithTenantIdArgs, @GqlReq() req) {
    const { tenantId } = args
    return this.userService.findAll(tenantId)
  }

  @Mutation(() => Number)
  async chooseOrganizations(@GqlReq() req: any, @Args() args: ChooseOrganizationsArgs) {
    const { user } = req
    const { organizationName } = args
    const default_db = process.env['MYSQL_DATABASE']
    const DATABASE_URL = process.env['DATABASE_URL'].replace(default_db, organizationName)

    console.log('add.QUEUE_CHANGING_DB_URL invoke.DATABASE_URL', DATABASE_URL)
    this.changeUrlQueue.add('QUEUE_CHANGING_DB_URL', { DATABASE_URL, organizationName })

    return 1
  }
}
