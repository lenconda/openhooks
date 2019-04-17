import { Service } from 'typedi'
import { execSync } from 'child_process'
import { routersFile, keysFile } from '../../../utils/constants'
import Routers from '../../../utils/routers'
import Keys from '../../../utils/keys'
import { NotFoundError, UnauthorizedError } from 'routing-controllers'
import { Context } from 'koa'

@Service()
export default class HooksService {
  executeCommand(id: string, context: Context) {
    try {
      const routers = new Routers(routersFile)
      const keys = new Keys(keysFile)
      const route = routers.find(id)
      if (!route) throw new NotFoundError('Webhook not found...')
      else {
        const key = context.request.headers['access-key']
        if (route.auth && !keys.get().includes(key))
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
