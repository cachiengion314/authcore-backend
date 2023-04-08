import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Award } from 'src/@generated/award/award.model'

@ObjectType()
export class AwardConnection extends PaginatedResponse(Award) {}
