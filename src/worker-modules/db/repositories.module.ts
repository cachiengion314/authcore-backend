import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { Repositories } from './repositories.processor'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'REGISTER_QUEUE_CHANGE_DB_URL',
    }),
  ],
  providers: [Repositories],
  exports: [Repositories],
})
export class RepositoriesModule {}
