import 'reflect-metadata'
import kcors from 'kcors'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import serve from 'koa-static'
import path from 'path'
import { getConnection } from '../../database/connections'
import { useKoaServer, useContainer, Action } from 'routing-controllers'
import { validateToken, getUserIDByToken } from '../util/authorization'
import { Container } from 'typedi'
import config from '../config'
import Initializer from '../../util/initializer'

new Initializer().run()

getConnection().then(async connection => {
  const app = new Koa()

  app.use(
      async (ctx, next): Promise<any> => {
        try {
          await next()
        } catch (e) {
          ctx.status = e.status || e.httpCode || 403
          ctx.body = {
            status: ctx.status || 403,
            message: e.message,
            data: e.errors ? e.errors : {}
          }
        }
      }
  )

  app.use(kcors())
  app.use(serve(path.resolve(__dirname, '../../../dashboard')))
  app.use(bodyParser())

  if (config.isDev) app.use(logger())

  const port: number = parseInt(process.argv[2]) || 5000

  useContainer(Container)
  useKoaServer(app, {
    routePrefix: '',
    controllers: [__dirname + '/controllers/*.{ts,js}'],
    middlewares: [__dirname + '/middlewares/*.{ts,js}'],
    defaults: {
      paramOptions: { required: false }
    },
    authorizationChecker: async (action: Action) => validateToken(action.request.headers['authorization']),
    currentUserChecker: async (action: Action) => getUserIDByToken(action.request.headers['authorization']),
    defaultErrorHandler: false,
    classTransformer: false
  }).listen(port)
})
