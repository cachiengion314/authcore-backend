import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { UserVote } from 'src/@generated/user-vote/user-vote.model'

@ObjectType()
export class UserVoteConnection extends PaginatedResponse(UserVote) {}
