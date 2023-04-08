import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { IndustryResolver } from './industry.resolver'
import { IndustryService } from './industry.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [IndustryResolver, IndustryService],
  exports: [IndustryService],
})
export class IndustryModule {}
