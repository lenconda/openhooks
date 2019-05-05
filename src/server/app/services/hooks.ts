import { Service } from 'typedi'
import { execSync } from 'child_process'
import {
  NotFoundError,
  UnauthorizedError } from 'routing-controllers'
import uuidv1 from 'uuid/v1'
import { Context } from 'koa'
import { getManager, Repository } from 'typeorm'
import RoutersEntity from '../../../database/entity/routers'
import KeysEntity from '../../../database/entity/keys'
import LogsEntity from '../../../database/entity/logs'
import AuthsEntity from '../../../database/entity/auths'

@Service()
export default class HooksService {
  constructor() {
    this.routersModel = getManager().getRepository(RoutersEntity)
    this.keysModel = getManager().getRepository(KeysEntity)
    this.logsModel = getManager().getRepository(LogsEntity)
    this.authsModel = getManager().getRepository(AuthsEntity)
  }

  private routersModel: Repository<RoutersEntity>
  private keysModel: Repository<KeysEntity>
  private logsModel: Repository<LogsEntity>
  private authsModel: Repository<AuthsEntity>

  async executeCommand(id: string, context: Context, callback: string = 'access-key') {
    const route = await this.routersModel.findOne({ uuid: id })
    if (!route) {
      throw new NotFoundError('Webhook not found...')
    } else {
      const recorderEntity = new LogsEntity()
      recorderEntity.uuid = uuidv1().split('-').join('')
      recorderEntity.routerId = id
      recorderEntity.triggerTime = Date.parse(new Date().toString()).toString()
      try {
        const key = context.request.headers[callback.toLowerCase()]
        const allKeys = await this.authsModel.find({ hookId: id })
        const keys = allKeys.map((value, index) => value.key)
        if (route.auth && !keys.includes(key))
          throw new UnauthorizedError('No access key matches...')
        const message = execSync(route.command, { encoding: 'utf-8' }).toString()
        const result = { routerId: id, result: message, succeeded: true}
        recorderEntity.result = message
        recorderEntity.succeeded = true
        await this.logsModel.save(recorderEntity)
        return result
      } catch (e) {
        recorderEntity.result = e.toString()
        recorderEntity.succeeded = false
        await this.logsModel.save(recorderEntity)
        throw e
      }
    }
  }
}
