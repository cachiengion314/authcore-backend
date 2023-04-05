import { IsNotEmpty, MinLength } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
  @Field()
  username: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string
}
