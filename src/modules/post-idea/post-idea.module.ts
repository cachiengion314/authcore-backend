import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { PostIdeaResolver } from './post-idea.resolver'
import { PostIdeaService } from './post-idea.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [PostIdeaResolver, PostIdeaService],
  exports: [PostIdeaService],
})
export class PostIdeaModule {}
