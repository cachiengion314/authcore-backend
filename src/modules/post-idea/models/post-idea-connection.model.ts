import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { PostIdea } from 'src/@generated/post-idea/post-idea.model'

@ObjectType()
export class PostIdeaConnection extends PaginatedResponse(PostIdea) {}
