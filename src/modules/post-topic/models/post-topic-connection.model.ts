import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { PostTopic } from 'src/@generated/post-topic/post-topic.model'

@ObjectType()
export class PostTopicConnection extends PaginatedResponse(PostTopic) {}
