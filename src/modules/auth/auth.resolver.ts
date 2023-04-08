import { Resolver, Mutation, Args, Parent, ResolveField } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { Auth } from './models/auth.model'
import { Token } from './models/token.model'
import { LoginInput } from './dto/login.input'
import { RefreshTokenInput } from './dto/refresh-token.input'
import { User } from '../../@generated/user/user.model'

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async login(@Args('data') data: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      data.tenantId,
      data.email,
      data.password
    )

    return {
      accessToken,
      refreshToken,
    }
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token)
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken)
  }
}
