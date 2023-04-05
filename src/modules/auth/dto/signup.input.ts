import { IsNotEmpty, MinLength } from 'class-validator'
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class SignupInput {
  @Field()
  username: string

  @Field()
  email: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Field({ nullable: true })
  firstname?: string

  @Field({ nullable: true })
  lastname?: string

  @Field({ nullable: true })
  tenantId?: string

  @Field({ nullable: true })
  databaseUrl?: string
}
