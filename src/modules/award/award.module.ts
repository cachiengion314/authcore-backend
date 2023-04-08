import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { AwardResolver } from './award.resolver'
import { AwardService } from './award.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [AwardResolver, AwardService],
  exports: [AwardService],
})
export class AwardModule {}
