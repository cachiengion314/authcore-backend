import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { PostResolver } from './post.resolver'
import { PostService } from './post.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}