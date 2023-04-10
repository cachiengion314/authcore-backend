import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { PostTag } from 'src/@generated/post-tag/post-tag.model'

@ObjectType()
export class PostTagConnection extends PaginatedResponse(PostTag) {}
