import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Feedback } from 'src/@generated/feedback/feedback.model'

@ObjectType()
export class FeedbackConnection extends PaginatedResponse(Feedback) {}
