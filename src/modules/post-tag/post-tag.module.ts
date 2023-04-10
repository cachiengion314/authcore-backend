import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { PostTagResolver } from './post-tag.resolver'
import { PostTagService } from './post-tag.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [PostTagResolver, PostTagService],
  exports: [PostTagService],
})
export class PostTagModule {}
