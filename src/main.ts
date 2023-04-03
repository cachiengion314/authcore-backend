import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma'
import { AppModule } from './app.module'
import { NestConfig, CorsConfig, SwaggerConfig } from './common/configs/config.interface'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      exceptionFactory: (e) => {
        console.log(e)
        throw new BadRequestException('Bad user input')
      },
    })
  )

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService)
  prismaService.enableShutdownHooks(app)

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))

  const configService = app.get(ConfigService)
  const nestConfig = configService.get<NestConfig>('nest')
  const corsConfig = configService.get<CorsConfig>('cors')
  const swaggerConfig = configService.get<SwaggerConfig>('swagger')

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document)
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors()
  }

  app.listen(process.env.PORT || nestConfig.port || 4000).then((server) => {
    new Logger(AppModule.name).log(`🚀  Server is listening on port ${configService.get('PORT')}`)
  })
}
bootstrap()
