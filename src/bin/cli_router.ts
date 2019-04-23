#!/usr/bin/env node

import program from 'commander'
import inquirer from 'inquirer'
import Initializer from '../utils/initializer'
import { openhooksDir, databaseFile } from '../utils/constants'
import Routers from '../utils/routers'
import JSONFile from '../utils/json_file'
import Keys from '../utils/keys'
import path from 'path'
import moment from 'moment'

new Initializer(openhooksDir, databaseFile).run()

program.version(
  new JSONFile(path.resolve(__dirname, '../../package.json')).read().version
)

program
  .command('generate')
  .description('generate route for a webhook')
  .action(options => {
    const questions = [
      {
        type: 'input',
        name: 'auth',
        message: 'Authentication requirement (false)'
      },
      {
        type: 'input',
        name: 'command',
        message: 'The command for this webhook (null)'
      },
      {
        type: 'input',
        name: 'desc',
        message: 'The description for this webhook (null)'
      }
    ]
    inquirer.prompt(questions).then(async (answers: any) => {
      const { desc, command, auth } = answers
      try {
        const authBool = auth === 'true'
        const id = await new Routers(databaseFile).add({
          desc: desc || '',
          command: command || '',
          auth: authBool
        })
        const { length } = await new Keys(databaseFile).get()
        if (authBool && length === 0)
          console.log(
            `There are no keys, generated a new key: ${await new Keys(
              databaseFile
            ).generate()}`
          )
        console.log(`Generated a webhook: ${id}`)
      } catch (e) {
        console.log(`Unable to generate a webhook: /hooks/${e.toString()}`)
      }
    })
  })

program
  .command('list')
  .description('list all webhooks of the server')
  .action(async () => {
    try {
      const results = await new Routers(databaseFile).get()
      const webhooks = results.map((value, index) => {
        const { path, command, auth, desc, createTime, updateTime } = value
        return {
          path,
          description: desc,
          command,
          auth,
          createTime: moment(createTime).format('YYYY-MM-DD HH:mm:ss'),
          updateTime: updateTime
            ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
            : null
        }
      })
      console.log(`Total: ${webhooks.length}`)
      console.table(webhooks)
    } catch (e) {
      console.log(`Unable to list webhooks: ${e.toString()}`)
    }
  })

program
  .command('delete <uuid>')
  .description('delete a webhook with specified index')
  .action(async uuid => {
    try {
      const deletedId = await new Routers(databaseFile).delete(uuid)
      console.log(`Deleted webhook: /hooks/${deletedId}`)
    } catch (e) {
      console.log(`Unable to delete webhook with uuid ${uuid}: ${e.toString()}`)
    }
  })

program
  .command('update <uuid>')
  .description('update a webhook')
  .option(
    '-a --auth [boolean]',
    'change the authentication requirement of the webhook'
  )
  .option('-c --new-command [cmd]', 'add command when the webhook is triggered')
  .option('-d --desc [description]', 'add description for the webhook')
  .action(async (uuid, options) => {
    try {
      const { desc, newCommand, auth } = options
      const updatedId = await new Routers(databaseFile).update(uuid, {
        updateCmd: newCommand,
        auth,
        desc
      })
      console.log(`Updated webhook: /hooks/${updatedId}`)
    } catch (e) {
      console.log(`Unable to update webhook with uuid ${uuid}: ${e.toString()}`)
    }
  })

program
  .command('clear')
  .description('clear all webhooks')
  .action(async () => {
    try {
      const routers = await new Routers(databaseFile).clear()
      if (routers.length === 0) console.log(`Cleared all webhooks`)
      else console.log(`Something wrong when clearing webhooks`)
    } catch (e) {
      console.log(`Unable to clear webhooks: ${e.toString()}`)
    }
  })

program.parse(process.argv)
