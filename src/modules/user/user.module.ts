import { Module } from '@nestjs/common'
import { UserResolver } from './user.resolver'
import { UserService } from './user.service'
import { RepositoriesModule } from '../db/repositories.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    RepositoriesModule,
    BullModule.registerQueue({
      name: 'REGISTER_QUEUE_CHANGE_DB_URL',
    }),
  ],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
