import Database from './database'
import uuidv1 from 'uuid/v1'

export interface InsertRecord {
  routerId: string
  result: string
  succeeded: boolean
}

class Recorder extends Database {
  constructor(databaseFilePath: string) {
    super(databaseFilePath)
  }

  async insert(data: InsertRecord): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const generatedUuid = uuidv1()
        .split('-')
        .join('')
      await this.dbRun(
        `INSERT INTO oh_logs(uuid, router_id, trigger_time, result, succeeded) 
        VALUES ($uuid, $routerId, $triggerTime, $result, $succeeded)`,
        {
          $uuid: generatedUuid,
          $routerId: data.routerId,
          $triggerTime: Date.parse(new Date().toString()),
          $result: data.result,
          $succeeded: data.succeeded
        }
      )
      resolve()
    })
  }
}

export default Recorder
