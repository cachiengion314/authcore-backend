import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'REGISTER_QUEUE_CHANGE_DB_URL',
    }),
  ],
})
export class RepositoriesModule {}
