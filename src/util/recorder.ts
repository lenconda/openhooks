import uuidv1 from 'uuid/v1'

import LogsEntity from '../database/entity/logs'
import { getConnection } from '../database/connections'
import { Repository } from 'typeorm'

export interface InsertRecord {
  routerId: string
  result: string
  succeeded: boolean
}

class Recorder {
  async insert(data: InsertRecord): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const connection = await getConnection()
      const logsModel: Repository<LogsEntity> = await connection.getRepository(LogsEntity)
      const generatedUuid = uuidv1()
        .split('-')
        .join('')
      const logsEntity = new LogsEntity()
      logsEntity.uuid = generatedUuid
      logsEntity.routerId = data.routerId
      logsEntity.triggerTime = Date.parse(new Date().toString()).toString()
      logsEntity.result = data.result
      logsEntity.succeeded = data.succeeded
      await logsModel.save(logsEntity)
      await connection.close()
      resolve()
    })
  }
}

export default Recorder
