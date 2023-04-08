import { Module } from '@nestjs/common'
import { PrismaClientManagerModule } from '../db/client-manager.module'
import { DepartmentResolver } from './department.resolver'
import { DepartmentService } from './department.service'

@Module({
  imports: [PrismaClientManagerModule],
  providers: [DepartmentResolver, DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}
