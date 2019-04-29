#!/usr/bin/env node

import program from 'commander'
import Server from '../util/server'
import JSONFile from '../util/json_file'
import path from 'path'

program
  .version(
    new JSONFile(path.resolve(__dirname, '../../package.json')).read().version
  )
  .option('-a, --server-action <action>', 'server action: start|restart|stop')
  .option('-p, --port [port]', 'server port, default 5000')
  .parse(process.argv)

const { serverAction, port } = program
try {
  const server = new Server(port || '5000')
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
