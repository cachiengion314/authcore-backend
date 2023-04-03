import { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'

@Processor('REGISTER_QUEUE_CHANGE_DB_URL')
export class Repositories {
  @Process('QUEUE_CHANGING_DB_URL')
  async handleChangingDbUrl(job: Job) {
    console.log(`handleChangingDbUrl.job.data`, job.data)
    const { DATABASE_URL, organizationName } = job.data

    const exec = require('child_process').exec
    exec(
      `export DATABASE_URL=${DATABASE_URL}; npx prisma migrate dev --name update;`,
      (err, stdout, stderr) => {
        console.log('stdout: ', stdout)
        console.log('sterr: ', stderr)

        if (err !== null) {
          console.log('err ', err)
        }

        exec(`npx ts-node prisma/seed.ts ${organizationName}`, (err2, stdout2, stderr2) => {
          console.log('stdout2: ', stdout2)
          console.log('stderr2: ', stderr2)
          if (err2 !== null) {
            console.log('err2 ', err2)
          }
        })
      }
    )
  }
}
