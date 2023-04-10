import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { IdeaResolver } from './idea.resolver'
import { IdeaService } from './idea.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [IdeaResolver, IdeaService],
  exports: [IdeaService],
})
export class IdeaModule {}
