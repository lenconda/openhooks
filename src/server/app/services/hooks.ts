import { Service } from 'typedi'
import { execSync } from 'child_process'
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError
} from 'routing-controllers'
import uuidv1 from 'uuid/v1'
import { Context } from 'koa'
import { getManager, Repository } from 'typeorm'
import RoutersEntity from '../../../database/entity/routers'
import KeysEntity from '../../../database/entity/keys'
import LogsEntity from '../../../database/entity/logs'

@Service()
export default class HooksService {
  constructor() {
    this.routersModel = getManager().getRepository(RoutersEntity)
    this.keysModel = getManager().getRepository(KeysEntity)
    this.logsModel = getManager().getRepository(LogsEntity)
  }

  private routersModel: Repository<RoutersEntity>
  private keysModel: Repository<KeysEntity>
  private logsModel: Repository<LogsEntity>

  async executeCommand(id: string, context: Context) {
    const route = await this.routersModel.findOne({ uuid: id })
    if (!route) {
      throw new NotFoundError('Webhook not found...')
    } else {
      const recorderEntity = new LogsEntity()
      try {
        const key = context.request.headers['access-key']
        const allKeys = await this.keysModel.find()
        const keys = allKeys.map((value, index) => value.value)
        if (route.auth && !keys.includes(key))
          throw new UnauthorizedError('No access key matches...')
        const message = execSync(route.command, { encoding: 'utf-8' }).toString()
        const result = { routerId: id, result: message, succeeded: true}
        recorderEntity.uuid = uuidv1().split('-').join('')
        recorderEntity.routerId = id
        recorderEntity.result = message
        recorderEntity.succeeded = true
        await this.logsModel.save(recorderEntity)
        return result
      } catch (e) {
        recorderEntity.uuid = uuidv1().split('-').join('')
        recorderEntity.routerId = id
        recorderEntity.result = e.toString()
        recorderEntity.succeeded = false
        await this.logsModel.save(recorderEntity)
        throw new InternalServerError(e)
      }
    }
  }
}
