import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Tag } from 'src/@generated/tag/tag.model'

@ObjectType()
export class TagConnection extends PaginatedResponse(Tag) {}
