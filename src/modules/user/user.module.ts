import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [PrismaClientManagerModule, AuthModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
