import { ObjectType } from '@nestjs/graphql'
import { User } from '../../../@generated/user/user.model'
import PaginatedResponse from '../../../common/pagination/pagination'

@ObjectType()
export class UserConnection extends PaginatedResponse(User) {}
