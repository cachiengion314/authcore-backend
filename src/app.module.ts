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
import { AuthModule } from './modules/auth/auth.module'
import { DepartmentModule } from './modules/department/department.module'
import { AwardModule } from './modules/award/award.module'
import { IndustryModule } from './modules/industry/industry.module'
import { PostModule } from './modules/post/post.module'
import { PostTagModule } from './modules/post-tag/post-tag.module'
import { PostTopicModule } from './modules/post-topic/post-topic.module'
import { TagModule } from './modules/tag/tag.module'
import { TopicModule } from './modules/topic/topic.module'
import { UserIndustryModule } from './modules/user-industry/user-industry.module'
import { IdeaModule } from './modules/idea/idea.module'
import { UserVoteModule } from './modules/user-vote/user-vote.module'
import { FeedbackModule } from './modules/feedback/feedback.module'

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
    DepartmentModule,
    AwardModule,
    IndustryModule,
    PostModule,
    PostTagModule,
    PostTopicModule,
    PostTagModule,
    IdeaModule,
    TagModule,
    TopicModule,
    UserIndustryModule,
    UserVoteModule,
    FeedbackModule,
  ],
})
export class AppModule {}
