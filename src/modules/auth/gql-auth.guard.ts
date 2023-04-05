import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GqlExecutionContext } from '@nestjs/graphql'

/**
 * GqlJwtAuthGuard sẽ làm req obj có thêm trường user
 * @example
 *  \@UseGuards(GqlJwtAuthGuard) 
    \@Mutation(() => Number) 
    async changePassword( 
      \@GqlReq() req: any, 
      \@Args() changePassword: ChangePasswordInput 
    ): Promise<number> { 
      const user = req.user 
      return this.usersService.changePassword(user.id, user.password, changePassword) 
    }
 */
@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
