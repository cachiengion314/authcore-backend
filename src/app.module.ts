import { GraphQLModule } from '@nestjs/graphql'
import { Module, CacheModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from 'nestjs-prisma'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GqlConfigService } from './gql-config.service'
import config from './common/configs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { UserModule } from './modules/user/user.module'
import { FileModule } from './modules/file/file.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    AuthModule,
    UserModule,
    FileModule,
  ],
})
export class AppModule {}
