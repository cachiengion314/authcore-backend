import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { Repositories } from '../src/modules/db/repositories.provider'
import { Profile } from '@prisma/client'

describe('app (e2e)', () => {
  let app: INestApplication
  let prisma: Repositories

  beforeEach(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = appModule.createNestApplication()
    prisma = app.get<Repositories>('Repositories')
    await app.init()
  })
  afterAll(async () => {
    await prisma.$disconnect()
    await app.close()
  })

  it('should be defined in the first place', () => {
    expect(app).toBeDefined()
  })

  const gql = '/graphql'

  describe(gql, () => {
    const _query = `
    {
      profiles {
        nodes {
          id
          fullName
        }
      }
    }
    `

    describe('QUERY profiles', () => {
      it('should get the profiles array', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: _query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.profiles.nodes).toBeInstanceOf<Profile[]>
          })
      })
    })

    const _bad_query = `
    {
      profiles(where: { fullName: { equals: "qwer" } }) {
        nodes {
          id
          fullName
        }
      }
    }
    `
    describe('QUERY profiles(where: { fullName: { equals: "qwer" } }) {', () => {
      it('should get empty array for bad input', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: _bad_query })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.profiles.nodes).toHaveLength(0)
          })
      })
    })

    describe('MUTATION createLocations should create Binh Duong location', () => {
      const _loginAdminQuery = `mutation {
        login(data: { username: "admin", password: "12345678" }) {
          user {
            id
            username
            email
          }
          accessToken
          refreshToken
        }
      }
      `
      const _mutationSaveLocations = `mutation {
        saveLocations(
          data: [
            {
              description: "day la dau toi la ai"
              level: District
              prefix: "fd"
              name: "Binh Duong"
              status: Active
            }
          ]
        )
      }
      `
      let accessToken
      it('should create Binh_Duowng location', () => {
        return request(app.getHttpServer())
          .post(gql)
          .send({ query: _loginAdminQuery })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.login.accessToken).toBeDefined()
            accessToken = res.body.data.login.accessToken
            console.log(`accessToken`, accessToken)
            // request(app.getHttpServer())
            //   .post(gql)
            //   .set({
            //     "authorization": accessToken
            //   })
            //   .send({ query: _mutationSaveLocations })
            //   .expect(200)
            //   .expect((res) => {
            //     expect(res.body.data.saveLocations).toEqual(1)
            //   })
            //   .then(() => {
            //     request(app.getHttpServer())
            //       .post(gql)
            //       .send({
            //         query: `{
            //         locations {
            //           nodes {
            //             id
            //             name
            //           }
            //         }
            //       }
            //       ` })
            //       .expect(200)
            //       .expect((res) => {
            //         expect(res.body.data.locations.nodes).toBeInstanceOf<Location[]>;
            //       })
            //   })
          })
      })
    })
  })
})
