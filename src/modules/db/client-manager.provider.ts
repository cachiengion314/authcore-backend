import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

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
      })
      this.clients[tenantId] = client
    }
    return client
  }
}
