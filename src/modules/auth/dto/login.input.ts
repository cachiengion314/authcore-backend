import { IsNotEmpty, MinLength } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  @Field(() => String, { nullable: true })
  email: string

  @Field()
  username: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string

  @Field()
  tenantId: string
}
