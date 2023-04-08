const { PrismaClient, RoleType, Prisma } = require('@prisma/client')
const bcrypt = require('bcrypt')

let bash_arguments = []
process.argv.forEach(function (val, index, array) {
  bash_arguments.push(val)
})
const defaultDB = process.env['MYSQL_DATABASE']

const tenantId = bash_arguments[2] || process.env['MYSQL_DATABASE']
console.log(`tenantId`, tenantId)

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env['DATABASE_URL'].replace(defaultDB, tenantId) || 'default_db' },
  },
})

async function main() {
  const models = Prisma.dmmf.datamodel.models
  await clearDatabase(models)
  const { admin } = await seedTenantAdmin()

  await seedDepartment(admin)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    console.log('🌱  The seed command has been executed.')
    await prisma.$disconnect()
  })

/**
 *
 * --------------- * ------private-utilities-function--------- * ---------------
 */

async function seedTenantAdmin() {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash('12345678', salt)

  const root = await prisma.user.create({
    data: {
      password: hash,
      fullName: 'root',
      originalId: 'azure002',
      email: `root@root.com`,
      isAdmin: true,
    },
  })
  const admin = await prisma.user.create({
    data: {
      password: hash,
      fullName: 'admin',
      originalId: 'azure001',
      email: `admin@admin.com`,
      isAdmin: true,
      createdBy: { connect: { id: root.id } },
      updatedBy: { connect: { id: root.id } },
    },
  })

  await prisma.role.createMany({
    data: [
      {
        name: 'root',
        description: 'Root',
        type: RoleType.Root,
      },
      {
        name: 'admin',
        description: 'Admin',
        type: RoleType.Admin,
      },
      {
        name: 'customer',
        description: 'Customer',
        type: RoleType.Customer,
      },
      {
        name: 'developer',
        description: 'Developer',
        type: RoleType.Developer,
      },
    ],
  })

  await prisma.casbinRule.createMany({
    data: [
      {
        id: 1,
        ptype: 'g',
        v0: 'admin',
        v1: 'admin',
      },
      {
        id: 2,
        ptype: 'p',
        v0: 'admin',
        v1: 'role',
        v2: 'read',
      },
      {
        id: 3,
        ptype: 'p',
        v0: 'admin',
        v1: 'role',
        v2: 'create',
      },
      {
        id: 4,
        ptype: 'p',
        v0: 'admin',
        v1: 'role',
        v2: 'delete',
      },
      {
        id: 5,
        ptype: 'p',
        v0: 'admin',
        v1: 'role',
        v2: 'update',
      },
    ],
  })

  return { admin, root }
}

async function seedDepartment(admin) {
  let data = [
    {
      code: 'd001',
      name: 'department1',
      description: 'department1 description',
      createdById: admin.id,
      updatedById: admin.id,
    },
    {
      code: 'd002',
      name: 'department2',
      description: 'department2 description',
      createdById: admin.id,
      updatedById: admin.id,
    },
  ]

  await prisma.department.createMany({
    data: data,
  })
}

async function clearDatabase(models) {
  for (let i = 0; i < models.length; ++i) {
    const dbName = models[i].name[0].toLowerCase() + models[i].name.slice(1)
    if (!prisma[dbName]) {
      continue
    }
    await prisma[dbName].deleteMany()
  }
}
