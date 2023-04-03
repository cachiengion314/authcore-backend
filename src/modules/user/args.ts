import { Field } from '@nestjs/graphql'
import { ArgsType } from '@nestjs/graphql'
import { UserWhereInput } from 'src/@generated/user/user-where.input'

@ArgsType()
export class ChooseOrganizationsArgs {
  @Field(() => String, { nullable: false })
  organizationName!: string
}

@ArgsType()
export class FindManyUsersWithTenantIdArgs {
  @Field(() => String, { nullable: false })
  tenantId!: string

  @Field(() => UserWhereInput, { nullable: true })
  where?: UserWhereInput
}
