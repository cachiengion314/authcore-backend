import { Field, ArgsType } from '@nestjs/graphql'
import { IsNotEmpty, MinLength } from 'class-validator'

@ArgsType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string
}
