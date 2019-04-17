#!/usr/bin/env node

import program from 'commander'
import Initializer from '../utils/initializer'
import { openhooksDir, routersFile, keysFile } from '../utils/constants'
import JSONFile from '../utils/json_file'
import Keys from '../utils/keys'
import path from 'path'

new Initializer(openhooksDir, keysFile, routersFile).run()

program.version(
  new JSONFile(path.resolve(__dirname, '../../package.json')).read().version
)

program
  .command('generate')
  .description('generate an access key')
  .action(options => {
    try {
      const keyId = new Keys(keysFile).generate()
      console.log(`Generated a new key: ${keyId}`)
    } catch (e) {
      console.log(`Unable to generate key: ${e.toString()}`)
    }
  })

program
  .command('list')
  .description('list all keys of the server')
  .action(() => {
    try {
      const keys = new Keys(keysFile).get().map((value, index1) => {
        return { key: value }
      })
      console.table(keys)
    } catch (e) {
      console.log(`Unable to list keys: ${e.toString()}`)
    }
  })

program
  .command('delete <index>')
  .description('delete a key with specified index')
  .action(index => {
    try {
      const deletedKey = new Keys(keysFile).remove(parseInt(index))
      console.log(`Deleted a key: ${deletedKey}`)
    } catch (e) {
      console.log(`Unable to delete the key: ${e.toString()}`)
    }
  })

program
  .command('clear')
  .description('clear all keys')
  .action(() => {
    try {
      const keys = new Keys(keysFile).clear()
      if (keys.length === 0) console.log(`Cleard all keys`)
      else console.log(`Something wrong when clearing keys`)
    } catch (e) {
      console.log(`Unable to clean keys: ${e.toString()}`)
    }
  })

program.parse(process.argv)
