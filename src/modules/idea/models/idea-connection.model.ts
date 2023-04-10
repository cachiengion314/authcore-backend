import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Idea } from 'src/@generated/idea/idea.model'

@ObjectType()
export class IdeaConnection extends PaginatedResponse(Idea) {}
