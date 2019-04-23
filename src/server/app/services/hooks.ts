import { Service } from 'typedi'
import { execSync } from 'child_process'
import { databaseFile } from '../../../utils/constants'
import Routers from '../../../utils/routers'
import Keys from '../../../utils/keys'
import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { Context } from 'koa'

@Service()
export default class HooksService {
  async executeCommand(id: string, context: Context) {
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
        return {
          ok: true,
          message: execSync(route.command, { encoding: 'utf-8' }).toString()
        }
      }
    } catch (e) {
      throw e
    }
  }
}
