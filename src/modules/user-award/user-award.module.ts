import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { UserAwardResolver } from './user-award.resolver'
import { UserAwardService } from './user-award.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [UserAwardResolver, UserAwardService],
  exports: [UserAwardService],
})
export class UserAwardModule {}
