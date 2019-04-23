import pathExists from 'path-exists'
import path from 'path'
import fs from 'fs'
import fsExtra from 'fs-extra'
const testDir = path.resolve(__dirname, '../../.test')
const databaseSrcPath = path.resolve(__dirname, '../../openhooks.db')

class Initializer {
  constructor(appConfigDir: string, databaseFilePath: string) {
    this.appConfigDirPath = appConfigDir
    this.appConfigDirExists = pathExists.sync(appConfigDir)
    this.databaseFilePath = databaseFilePath
    this.databaseFileExists = pathExists.sync(databaseFilePath)
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

  run(test: boolean = false) {
    try {
      if (test) {
        if (!pathExists.sync(testDir)) this.initializeDir(testDir)
        if (
          !pathExists.sync(path.resolve(__dirname, '../../.test/openhooks.db'))
        )
          this.initializeFile(
            databaseSrcPath,
            path.resolve(testDir, 'openhooks.db')
          )
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
