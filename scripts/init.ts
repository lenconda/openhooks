import pathExists from 'path-exists'
import fs from 'fs'
import {
  openhooksDir,
  keysFile,
  routersFile } from '../src/utils/constants'

const initializeFIle = (path: string) => {
  fs.writeFileSync(path, JSON.stringify([]), { encoding: 'utf-8' })
  return
}

if (!pathExists.sync(openhooksDir)) {
  try {
    fs.mkdirSync(openhooksDir, { recursive: true })
    initializeFIle(keysFile)
    initializeFIle(routersFile)
  } catch (e) {
    throw e
  }
} else {
  try {
    if (!pathExists.sync(keysFile))
      initializeFIle(keysFile)
    if (!pathExists.sync(routersFile))
      initializeFIle(routersFile)
  } catch (e) {
    throw e
  }
}
