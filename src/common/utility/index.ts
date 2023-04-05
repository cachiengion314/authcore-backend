export function isArrayEmpty(arr: any): boolean {
  if (Array.isArray(arr) && arr.length > 0) {
    return false
  }
  return true
}

export function isObjEmpty(obj: any): boolean {
  if (!obj || Array.isArray(obj)) return true
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false
    }
  }
  return true
}

export function execCommand(cmd: string, silent = false) {
  const exec = require('child_process').exec

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout ? stdout : stderr)
    }).stdout.on('data', (r) => !silent && process.stdout.write(r))
  })
}

export function getDatabaseUrlFrom(tenantId: string) {
  const default_db = process.env['MYSQL_DATABASE']
  const DATABASE_URL = process.env['DATABASE_URL'].replace(default_db, tenantId)
  return DATABASE_URL
}
