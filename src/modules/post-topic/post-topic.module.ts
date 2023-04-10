import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { PostTopicResolver } from './post-topic.resolver'
import { PostTopicService } from './post-topic.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [PostTopicResolver, PostTopicService],
  exports: [PostTopicService],
})
export class PostTopicModule {}
