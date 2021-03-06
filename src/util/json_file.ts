import { writeFileSync, readFileSync } from 'fs'

class JSONFile {
  constructor(jsonFilePath: string) {
    this.path = jsonFilePath
  }

  private path: string

  read(): any {
    return JSON.parse(readFileSync(this.path, { encoding: 'utf-8' }))
  }

  write(newData: any): any {
    writeFileSync(this.path, JSON.stringify(newData), { encoding: 'utf-8' })
    return newData
  }
}

export default JSONFile
