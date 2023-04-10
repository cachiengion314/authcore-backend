import { Injectable } from '@nestjs/common'
import { PrismaClientManager } from '../db/client-manager.provider'
import { BaseService } from 'src/common/modules/base.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class PostService extends BaseService {
  constructor(private readonly prismaClientManager: PrismaClientManager) {
    super(Prisma.ModelName.Post, prismaClientManager)
  }
}
