import { Injectable } from '@nestjs/common'
import { PrismaClientManager } from '../db/client-manager.provider'
import { execCommand, getDatabaseUrlFrom } from 'src/common/utility'
import { CreateOneUserArgs } from 'src/@generated/user/create-one-user.args'
import { AuthService } from '../auth/auth.service'
import { throwBadRequestException } from 'src/common/utility/exception'
import { UserWhereInput } from 'src/@generated/user/user-where.input'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly authService: AuthService
  ) {}

  async createOneTenant(args: CreateOneUserArgs) {
    const { tenantId } = args.data
    if (!tenantId) {
      throwBadRequestException('tenantId is empty!')
    }
    const DATABASE_URL = getDatabaseUrlFrom(tenantId)
    /**
     * Create tenant's database base on tenantId, deploy mode will not trigger
     * generate, or seeding data event
     */
    await execCommand(`export DATABASE_URL=${DATABASE_URL}; npx prisma migrate deploy;`)
    await execCommand(`ts-node prisma/seed.ts ${tenantId}`)

    const { username, email, password, firstname, lastname } = args.data
    const result = await this.authService.createTenant({
      username,
      email,
      password,
      firstname,
      lastname,
      tenantId,
      databaseUrl: DATABASE_URL,
    })
    if (!result) {
      throwBadRequestException()
    }
    const { accessToken, refreshToken } = result
    return { accessToken, refreshToken }
  }

  findManyUsers(tenantId: string, where: UserWhereInput) {
    return this.prismaClientManager.getClient(tenantId).user.findMany({
      where,
    })
  }
}
