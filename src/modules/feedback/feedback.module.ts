import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { FeedbackResolver } from './feedback.resolver'
import { FeedbackService } from './feedback.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [FeedbackResolver, FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
