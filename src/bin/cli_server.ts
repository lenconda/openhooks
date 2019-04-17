#!/usr/bin/env node

import program from 'commander'
import Server from '../utils/server'
import Initializer from '../utils/initializer'
import { openhooksDir, routersFile, keysFile } from '../utils/constants'
import JSONFile from '../utils/json_file'
import path from 'path'

new Initializer(openhooksDir, keysFile, routersFile).run()

program
  .version(
    new JSONFile(path.resolve(__dirname, '../../package.json')).read().version
  )
  .option('-a, --server-action <action>', 'server action: start|restart|stop')
  .option('-p, --port [port]', 'server port, default 5000')
  .parse(process.argv)

let { serverAction, port } = program
try {
  let server = new Server(port || '5000')
  switch (serverAction) {
    case 'start':
      server.start()
      break
    case 'stop':
      server.stop()
      break
    case 'restart':
      server.restart()
      break
    default:
      program.outputHelp()
  }
} catch (e) {
  console.log(`Something error with server: ${e.toString()}`)
}
