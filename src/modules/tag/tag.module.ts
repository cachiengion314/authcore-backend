import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { TagResolver } from './tag.resolver'
import { TagService } from './tag.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
