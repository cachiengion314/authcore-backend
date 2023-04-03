import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const GqlReq = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req
)

export const GqlHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => GqlExecutionContext.create(ctx).getContext().req.headers
)

export const GqlAuthToken = createParamDecorator((data: unknown, ctx: ExecutionContext) =>
  GqlExecutionContext.create(ctx)
    .getContext()
    .req.headers.authorization?.replace(/Bearer\s*/, '')
)
