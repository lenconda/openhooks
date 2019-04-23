#!/usr/bin/env node

import program from 'commander'
import Initializer from '../utils/initializer'
import { openhooksDir, databaseFile } from '../utils/constants'
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
  .description('generate an access key')
  .action(async options => {
    try {
      const keyId = await new Keys(databaseFile).generate()
      console.log(`Generated a new key: ${keyId}`)
    } catch (e) {
      console.log(`Unable to generate key: ${e.toString()}`)
    }
  })

program
  .command('list')
  .description('list all keys of the server')
  .action(async () => {
    try {
      const rows = await new Keys(databaseFile).get()
      const keys = rows.map((value, index1) => {
        return {
          key: value.key,
          createTime: moment(value.createTime).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      console.log(`Total: ${keys.length}`)
      console.table(keys)
    } catch (e) {
      console.log(`Unable to list keys: ${e.toString()}`)
    }
  })

program
  .command('delete <value>')
  .description('delete a key with specified index')
  .action(async value => {
    try {
      const deletedKey = await new Keys(databaseFile).remove(value)
      console.log(`Deleted a key: ${deletedKey}`)
    } catch (e) {
      console.log(`Unable to delete the key: ${e.toString()}`)
    }
  })

program
  .command('clear')
  .description('clear all keys')
  .action(async () => {
    try {
      const keys = await new Keys(databaseFile).clear()
      if (keys.length === 0) console.log(`Cleard all keys`)
      else console.log(`Something wrong when clearing keys`)
    } catch (e) {
      console.log(`Unable to clean keys: ${e.toString()}`)
    }
  })

program.parse(process.argv)
