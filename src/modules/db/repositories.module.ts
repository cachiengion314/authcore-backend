import { Module } from '@nestjs/common'
import { PrismaClientManager } from './repositories.provider'

@Module({
  providers: [PrismaClientManager],
  exports: [PrismaClientManager],
})
export class RepositoriesModule {}
