/**
 * workder process application
 */
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WorkerModule } from './worker.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(WorkerModule)

  process.env.WORKER_PORT = process.env.WORKER_PORT ?? '4002'
  await app.listen(process.env.WORKER_PORT)
  new Logger(WorkerModule.name).log(`🚀 Worker is running on port ${process.env.WORKER_PORT}`)
}
bootstrap()
