import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common'

export const ERROR_DEFAULT_MESSAGE = "Something bad happened some how, we don't know yet"

export function throwBadRequestException(err: any = null) {
  if (process.env.NODE_ENV === 'development') {
    if (err) {
      console.log(err)
      throw new BadRequestException(err)
    }
  }
  console.log(err)
  throw new BadRequestException(ERROR_DEFAULT_MESSAGE)
}

export function throwHttpException(err: any = null) {
  if (process.env.NODE_ENV === 'development') {
    if (err) {
      console.log(err)
      throw new HttpException(
        {
          message: err,
        },
        HttpStatus.CONFLICT
      )
    }
  }
  console.log(err)
  throw new HttpException(
    {
      message: err,
    },
    HttpStatus.CONFLICT
  )
}
