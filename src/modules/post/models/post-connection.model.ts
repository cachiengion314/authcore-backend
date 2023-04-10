import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Post } from 'src/@generated/post/post.model'

@ObjectType()
export class PostConnection extends PaginatedResponse(Post) {}
