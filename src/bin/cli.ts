#!/usr/bin/env node

import program from 'commander'
import Server from '../utils/server'
import inquirer from 'inquirer'
import Initializer from '../utils/initializer'
import { openhooksDir, routersFile, keysFile } from '../utils/constants'
import Routers from '../utils/routers'
import Keys from '../utils/keys'

new Initializer(openhooksDir, keysFile, routersFile).run()

program
  .version('0.5.0')

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
        default: program.outputHelp()
      }
    } catch (e) {
      console.log(`Something error with server: ${e.toString()}`)
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
        try {
          let keyId = new Keys(keysFile).generate()
          console.log(`Generated a new key: ${keyId}`)
        } catch (e) {
          console.log(`Unable to generate key: ${e.toString()}`)
        }
        break
      case 'ls':
        try {
          let keys = new Keys(keysFile).get().map((value, index1) => {
            return { key: value }
          })
          console.table(keys)
        } catch (e) {
          console.log(`Unable to list keys: ${e.toString()}`)
        }
        break
      case 'del':
        try {
          let deletedKey = new Keys(keysFile).remove(parseInt(index))
          console.log(`Deleted a key: ${deletedKey}`)
        } catch (e) {
          console.log(`Unable to delete the key: ${e.toString()}`)
        }
        break
      case 'clear':
        try {
          let keys = new Keys(keysFile).clear()
          if (keys.length === 0) console.log(`Cleard all keys`)
          else console.log(`Something wrong when clearing keys`)
        } catch (e) {
          console.log(`Unable to clean keys: ${e.toString()}`)
        }
        break
      default: program.outputHelp()
    }
  })

program
  .command('add')
  .description('add a webhook')
  .action(options => {
    const questions = [
      { type: 'input', name: 'auth', message: 'Authentication requirement (false)' },
      { type: 'input', name: 'command', message: 'The command for this webhook' },
      { type: 'input', name: 'desc', message: 'The description for this webhook' }
    ]
    inquirer
      .prompt(questions)
      .then((answers: any) => {
        let { desc, command, auth } = answers
        let authBool = (JSON.parse(auth) === true ? true : false) || false
        try {
          let id = new Routers(routersFile).add({
            desc: desc || '',
            command: command || '',
            auth: authBool
          })
          if (authBool && (new Keys(keysFile).get().length === 0))
            console.log(`There are no keys, generated a new key: ${new Keys(keysFile).generate()}`)
          console.log(`Add a webhook: ${id}`)
        } catch (e) {
          console.log(`Unable to add a webhook: ${e.toString()}`)
        }
      })
  })

program
  .command('ls')
  .description('list all webhooks of the server')
  .action(() => {
    try {
      let webhooks = new Routers(routersFile).get().map((value, index) => {
        let { id, command, auth, desc } = value
        return {
          path: `/hooks/${id}`,
          description: desc, command, auth }
      })
      console.log(`Total: ${webhooks.length}`)
      console.table(webhooks)
    } catch (e) {
      console.log(`Unable to list webhooks: ${e.toString()}`)
    }
  })

program
  .command('del <index>')
  .description('delete a webhook with specified index')
  .action(index => {
    try {
      let deletedId = new Routers(routersFile).delete(parseInt(index))
      console.log(`Deleted webhook: /hooks/${deletedId}`)
    } catch (e) {
      console.log(`Unable to delete webhook at index ${index}: ${e.toString()}`)
    }
  })

program
  .command('update <index>')
  .description('update a webhook')
  .option('-a --auth [boolean]', 'change the authentication requirement of the webhook')
  .option('-c --new-command [cmd]', 'add command when the webhook is triggered')
  .option('-d --desc [description]', 'add description for the webhook')
  .action((index, options) => {
    try {
      let { desc, newCommand, auth } = options
      let updatedId = new Routers(routersFile).update(parseInt(index), desc, newCommand, auth)
      console.log(`Updated webhook: /hooks/${updatedId}`)
    } catch (e) {
      console.log(`Unable to update webhook at index ${index}: ${e.toString()}`)
    }
  })

program
  .command('clear')
  .description('clear all webhooks')
  .action(function () {
    try {
      let routers = new Routers(routersFile).clear()
      if (routers.length === 0) console.log(`Cleared all webhooks`)
      else console.log(`Something wrong when clearing webhooks`)
    } catch (e) {
      console.log(`Unable to clear webhooks: ${e.toString()}`)
    }
  })


program.parse(process.argv)
