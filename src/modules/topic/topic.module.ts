import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { TopicResolver } from './topic.resolver'
import { TopicService } from './topic.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [TopicResolver, TopicService],
  exports: [TopicService],
})
export class TopicModule {}
