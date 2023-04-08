import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { UserIndustry } from 'src/@generated/user-industry/user-industry.model'

@ObjectType()
export class UserIndustryConnection extends PaginatedResponse(UserIndustry) {}
