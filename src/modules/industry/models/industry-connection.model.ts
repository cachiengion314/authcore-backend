import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Industry } from 'src/@generated/industry/industry.model'

@ObjectType()
export class IndustryConnection extends PaginatedResponse(Industry) {}
