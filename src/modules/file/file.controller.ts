import { Controller, Get, Sse } from '@nestjs/common'
import { Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'

@Controller('files')
export class FileController {
  @Get()
  findAll(): string {
    return 'This action returns all files'
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } } as MessageEvent)))
  }
}
