import pathExists from 'path-exists'
import fs from 'fs'

class Initializer {

  constructor (
    appConfigDir: string, keysFilePath: string, routersFilePath: string) {
    this.appConfigDirPath = appConfigDir
    this.routersFilePath = routersFilePath
    this.keysFilePath = keysFilePath
    this.appConfigDirExists = pathExists.sync(appConfigDir)
    this.routersFileExists = pathExists.sync(routersFilePath)
    this.keysFileExists = pathExists.sync(keysFilePath)
  }

  private appConfigDirPath: string
  private routersFilePath: string
  private keysFilePath: string

  private appConfigDirExists: boolean
  private routersFileExists: boolean
  private keysFileExists: boolean

  private initializeDir (path: string) {
    fs.mkdirSync(path, { recursive: true })
  }

  private initializeFile (path: string) {
    fs.writeFileSync(
      path, JSON.stringify([]), { encoding: 'utf-8' })
  }

  public run () {
    if (!this.appConfigDirExists) {
      try {
        this.initializeDir(this.appConfigDirPath)
        this.initializeFile(this.routersFilePath)
        this.initializeFile(this.keysFilePath)
      } catch (e) {
        throw e
      }
    } else {
      try {
        if (!this.keysFileExists)
          this.initializeFile(this.keysFilePath)
        if (!this.routersFileExists)
          this.initializeFile(this.routersFilePath)
      } catch (e) {
        throw e
      }
    }
  }

}

export default Initializer
