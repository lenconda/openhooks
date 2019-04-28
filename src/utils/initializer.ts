import pathExists from 'path-exists'
import fs from 'fs'
import fsExtra from 'fs-extra'
import {
  databaseTestFile, testDir, openhooksDir, databaseFile, databaseSrcPath } from './constants'

class Initializer {
  constructor() {
    this.appConfigDirPath = openhooksDir
    this.appConfigDirExists = pathExists.sync(openhooksDir)
    this.databaseFilePath = databaseFile
    this.databaseFileExists = pathExists.sync(databaseFile)
  }

  private appConfigDirPath: string
  private databaseFilePath: string

  private appConfigDirExists: boolean
  private databaseFileExists: boolean

  private initializeDir(path: string) {
    fs.mkdirSync(path, { recursive: true })
  }

  private initializeFile(sourcePath: string, destinationPath: string) {
    fs.copyFileSync(sourcePath, destinationPath)
  }

  run() {
    const isTest = (process.env.NODE_ENV || 'prod') === 'test'
    this.init(isTest)
  }

  init(test: boolean = false) {
    try {
      if (test) {
        if (!pathExists.sync(testDir)) this.initializeDir(testDir)
        if (!pathExists.sync(databaseTestFile))
          this.initializeFile(databaseSrcPath, databaseTestFile)
      } else {
        if (!this.appConfigDirExists) this.initializeDir(this.appConfigDirPath)
        if (!this.databaseFileExists)
          this.initializeFile(databaseSrcPath, this.databaseFilePath)
      }
    } catch (e) {
      throw e
    }
  }

  clearTest() {
    try {
      fsExtra.removeSync(testDir)
    } catch (e) {
      throw e
    }
  }
}

export default Initializer
