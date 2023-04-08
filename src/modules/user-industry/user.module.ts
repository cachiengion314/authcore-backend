import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { UserIndustryResolver } from './user.resolver'
import { UserIndustryService } from './user.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [UserIndustryResolver, UserIndustryService],
  exports: [UserIndustryService],
})
export class UserModule {}
