#!/usr/bin/env node

import program from 'commander'
import * as routers from '../modules/routers'
import * as keys from '../modules/keys'
import Server from '../modules/server'

program
  .version('0.3.4')

program
  .command('server <action> [port]')
  .description('manage webhook server')
  .option('start', 'start the server')
  .option('stop', 'stop the server')
  .option('restart', 'restart the server')
  .action((option, port) => {
    try {
      let server = new Server(port || '5000')
      switch (option) {
        case 'start': server.start(); break
        case 'stop': server.stop(); break
        case 'restart': server.restart(); break
      }
    } catch (e) {
      console.log('params: start|restart|stop')
    }
  })

program
  .command('key <action> [index]')
  .description('manage access keys')
  .option('gen', 'generate an access key')
  .option('ls', 'list keys')
  .option('del', 'delete an access key with index')
  .option('clear', 'clear all keys')
  .action( (action, index) => {
    switch (action) {
      case 'gen':
        console.log(`Generated a new key: ${keys.generate()}`)
        break
      case 'ls':
        console.table(keys.ls())
        break
      case 'del':
        console.log('Deleted a key: ' + keys.remove(parseInt(index)))
        break
      case 'clear':
        let result = keys.clear()
        if (result.length === 0)
          console.log('Cleared all keys')
        break
      default:
        console.log('params: gen|ls|del|clear')
    }
  })

program
  .command('add')
  .description('add a webhook')
  .option('-a --auth [bool]', 'add command when the webhook is triggered')
  .option('-c --command <cmd>', 'add command when the webhook is triggered')
  .option('-d --desc <description>', 'add description for the webhook')
  .action(options => {
    let id = routers.add(options.desc, options.command, options.auth)
    console.log(`Added a new webhook: /hooks/${id}`)
  })

program
  .command('ls')
  .description('list all webhooks of the server')
  .action(() => {
    let result = routers.ls()
    console.log(`Total: ${result.length}`)
    console.table(result)
  })

program
  .command('del <index>')
  .description('delete a webhook with specified index')
  .action(index => {
    let result = routers.del(parseInt(index))
    console.log(`Deleted webhook: ${result}`)
  })

program
  .command('update <index>')
  .description('update a webhook')
  .option('-a --auth [boolean]', 'change the authentication requirement of the webhook')
  .option('-c --new-command [cmd]', 'add command when the webhook is triggered')
  .option('-d --desc [description]', 'add description for the webhook')
  .action((index, options) => {
    let path = routers.update(index, options.desc, options.newCommand, options.auth)
    console.log(`Updated webhook: ${path}`)
  })

program
  .command('clear')
  .description('clear all webhooks')
  .action(function () {
    routers.clear()
    console.log('Cleared all webhooks')
  })

program.parse(process.argv)
