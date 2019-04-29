import { Connection, ConnectionOptions, createConnection } from 'typeorm'
import { databaseFile, databaseTestFile } from '../util/constants'

import Routers from './entity/routers'
import Logs from './entity/logs'
import Keys from './entity/keys'
import Admin from './entity/admin'
import Initializer from '../util/initializer'

const options: ConnectionOptions = {
  type: 'sqlite',
  database:
      (process.env.NODE_ENV || 'production') === 'test' ? databaseTestFile : databaseFile,
  entities: [ Routers, Logs, Keys, Admin ],
  logging: false
}

export const getConnection = async (): Promise<Connection> => {
  new Initializer().run()
  const connection = await createConnection(options)
  return connection
}
