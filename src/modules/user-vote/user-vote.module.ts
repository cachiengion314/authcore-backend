import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { UserVoteResolver } from './user-vote.resolver'
import { UserVoteService } from './user-vote.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [UserVoteResolver, UserVoteService],
  exports: [UserVoteService],
})
export class UserVoteModule {}
