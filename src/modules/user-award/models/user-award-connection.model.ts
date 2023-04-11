import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { UserAward } from 'src/@generated/user-award/user-award.model'

@ObjectType()
export class UserAwardConnection extends PaginatedResponse(UserAward) {}
