import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { UserIndustryResolver } from './user-industry.resolver'
import { UserIndustryService } from './user-industry.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [UserIndustryResolver, UserIndustryService],
  exports: [UserIndustryService],
})
export class UserIndustryModule {}
