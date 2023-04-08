import { Prisma, User } from '@prisma/client'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PasswordService } from './password.service'
import { SignupInput } from './dto/signup.input'
import { Token } from './models/token.model'
import { SecurityConfig } from '../../common/configs/config.interface'
import { PrismaClientManager } from '../db/client-manager.provider'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaClientManager: PrismaClientManager,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService
  ) {}

  async createTenant(payload: SignupInput): Promise<Token> {
    const { tenantId } = payload
    const hashedPassword = await this.passwordService.hashPassword(payload.password)

    try {
      const user = await this.prismaClientManager.getClient(tenantId).user.create({
        data: {
          ...payload,
          password: hashedPassword,
        },
      })

      return this.generateTokens({
        userId: user.id,
        tenantId,
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`Username ${payload.username} already used.`)
      } else {
        throw new Error(e)
      }
    }
  }

  async login(tenantId: string, email: string, password: string): Promise<Token> {
    const user = await this.prismaClientManager
      .getClient(tenantId)
      .user.findUnique({ where: { email } })

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`)
    }

    const passwordValid = await this.passwordService.validatePassword(password, user.password)

    if (!passwordValid) {
      throw new BadRequestException('Invalid password')
    }

    return this.generateTokens({
      userId: user.id,
      tenantId,
    })
  }

  validateUser(tenantId: string, userId: string): Promise<User> {
    return this.prismaClientManager.getClient(tenantId).user.findUnique({ where: { id: userId } })
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId']
    const tenantId = this.jwtService.decode(token)['tenantId']
    return this.prismaClientManager.getClient(tenantId).user.findUnique({ where: { id } })
  }

  generateTokens(payload: { userId: string; tenantId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload)
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security')
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    })
  }

  refreshToken(token: string, tenantId = 'trm') {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      })

      return this.generateTokens({
        userId,
        tenantId,
      })
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  generateTokenFrom(payload: any, opt: { secret: string; expiresIn?: number }) {
    return this.jwtService.sign(payload, opt)
  }

  verifyTokenFrom(hash: string, opt: { secret: string }) {
    return this.jwtService.verify(hash, opt)
  }
}
