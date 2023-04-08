import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Topic } from 'src/@generated/topic/topic.model'

@ObjectType()
export class TopicConnection extends PaginatedResponse(Topic) {}
