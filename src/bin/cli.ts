#!/usr/bin/env node

import program from 'commander'
import inquirer from 'inquirer'
import Initializer from '../utils/initializer'
import { openhooksDir, routersFile, keysFile } from '../utils/constants'
import Routers from '../utils/routers'
import JSONFile from '../utils/json_file'
import Keys from '../utils/keys'
import path from 'path'

new Initializer(openhooksDir, keysFile, routersFile).run()

program
  .version(new JSONFile(path.resolve(__dirname, '../../package.json')).read().version)

program
  .command('generate')
  .description('generate a webhook')
  .action(options => {
    const questions = [
      { type: 'input', name: 'auth', message: 'Authentication requirement (false)' },
      { type: 'input', name: 'command', message: 'The command for this webhook (null)' },
      { type: 'input', name: 'desc', message: 'The description for this webhook (null)' }
    ]
    inquirer
      .prompt(questions)
      .then((answers: any) => {
        let { desc, command, auth } = answers
        try {
          let authBool = auth === 'true'
          let id = new Routers(routersFile).add({
            desc: desc || '',
            command: command || '',
            auth: authBool
          })
          if (authBool && (new Keys(keysFile).get().length === 0))
            console.log(`There are no keys, generated a new key: ${new Keys(keysFile).generate()}`)
          console.log(`Generated a webhook: ${id}`)
        } catch (e) {
          console.log(`Unable to generate a webhook: /hooks/${e.toString()}`)
        }
      })
  })

program
  .command('list')
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
  .command('delete <index>')
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
