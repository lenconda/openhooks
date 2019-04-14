import { writeFileSync, readFileSync } from 'fs'
import uuidv1 from 'uuid/v1'

class Keys {

  constructor (keysFilePath: string) {
    this.path = keysFilePath
    this.keys = this.readJson()
  }

  private path: string
  private keys: string[]

  private readJson () {
    return JSON.parse(
      readFileSync(this.path, { encoding: 'utf-8' }))
  }

  private writeJson (data: string[]) {
    writeFileSync(
      this.path, JSON.stringify(data), { encoding: 'utf-8' })
  }

  public get (): string[] {
    return this.keys
  }

  public generate (): string {
    let key = uuidv1().split('-').join('')
    this.keys.push(key)
    this.writeJson(this.keys)
    return key
  }

  public remove (idx: number): string {
    let deletedKey = this.keys[idx]
    this.keys = this.keys.filter((value, index) => idx !== index)
    this.writeJson(this.keys)
    return deletedKey
  }

  public clear (): string[] {
    this.keys = []
    this.writeJson(this.keys)
    return this.keys
  }

}

export default Keys
