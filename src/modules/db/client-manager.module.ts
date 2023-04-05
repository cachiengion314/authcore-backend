import { Module } from '@nestjs/common'
import { PrismaClientManager } from './client-manager.provider'

@Module({
  providers: [PrismaClientManager],
  exports: [PrismaClientManager],
})
export class PrismaClientManagerModule {}
