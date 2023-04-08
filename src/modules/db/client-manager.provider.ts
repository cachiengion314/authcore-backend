import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { useMediator } from 'src/common/middleware/prisma-middleware'

@Injectable()
export class PrismaClientManager {
  // the client instances cache object
  private clients: { [key: string]: PrismaClient } = {}

  getClient(tenantId: string = 'trm'): PrismaClient {
    let client = this.clients[tenantId]
    // create and cache a new client when needed
    if (!client) {
      const databaseUrl = process.env['DATABASE_URL'].replace(
        process.env['MYSQL_DATABASE'],
        tenantId
      )
      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'stdout', level: 'info' },
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ],
        errorFormat: 'pretty',
      })
      console.log(
        `\x1b[32m[Nest] 11111  - Repository strategy - Prisma version ${Prisma.prismaVersion.client}`
      )

      client.$use(async (param, next) => {
        /**
         * query middleware here
         */
        return useMediator(param, next)
      })
      if (!process.env.QUERY_LOG_DISABLE || process.env.QUERY_LOG_DISABLE === '0') {
        client.$on<any>('query', (event: Prisma.QueryEvent) => {
          console.log(`\nQUERY: ` + event.query)
          console.log(`\x1b[33m%s\x1b[0m`, `PARAMS: ` + event.params)
        })
        console.count(
          `\x1b[32m[Nest] 11111  - Feel free to add QUERY_LOG_DISABLE=1 into .env to disable log QUERY. log QUERY listener count`
        )
      }
      this.clients[tenantId] = client
    }
    return client
  }
}
