import { Injectable } from '@nestjs/common'
import { PrismaClientManager } from '../db/repositories.provider'

@Injectable()
export class UserService {
  private prismaClientManager: PrismaClientManager

  constructor(prismaClientManager: PrismaClientManager) {
    this.prismaClientManager = prismaClientManager
  }
  findAll(tenantId: string) {
    // just use this.prisma to access the database
    return this.prismaClientManager.getClient(tenantId).user.findMany()
  }
}
