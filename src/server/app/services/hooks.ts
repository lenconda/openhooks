import { Service } from 'typedi'
import { execSync } from 'child_process'
import { databaseFile } from '../../../utils/constants'
import Routers from '../../../utils/routers'
import Keys from '../../../utils/keys'
import Recorder from '../../../utils/recorder'
import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { Context } from 'koa'

@Service()
export default class HooksService {
  async executeCommand(id: string, context: Context) {
    const recorder = new Recorder(databaseFile)
    try {
      const route = await new Routers(databaseFile).find(id)
      if (!route) {
        throw new NotFoundError('Webhook not found...')
      } else {
        const key = context.request.headers['access-key']
        const keyRows = await new Keys(databaseFile).get()
        const keys = keyRows.map((value, index) => value.key)
        if (route.auth && !keys.includes(key))
          throw new UnauthorizedError('No access key matches...')
        const message = execSync(route.command, {
          encoding: 'utf-8'
        }).toString()
        const result = {
          routerId: id,
          result: message,
          succeeded: true
        }
        await recorder.insert(result)
        return result
      }
    } catch (e) {
      await recorder.insert({
        routerId: id,
        result: e.toString(),
        succeeded: false
      })
      throw e
    }
  }
}
