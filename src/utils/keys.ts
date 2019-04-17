import uuidv1 from 'uuid/v1'
import JSONFile from '../utils/json_file'

class Keys {
  constructor(keysFilePath: string) {
    this.path = keysFilePath
    this.keysFile = new JSONFile(this.path)
    this.keys = this.keysFile.read()
  }

  private path: string
  private keys: string[]
  private keysFile: JSONFile

  public get(): string[] {
    return this.keys
  }

  public generate(): string {
    let key = uuidv1()
      .split('-')
      .join('')
    this.keys.push(key)
    this.keysFile.write(this.keys)
    return key
  }

  public remove(idx: number): string {
    let deletedKey = this.keys[idx]
    this.keys = this.keys.filter((value, index) => idx !== index)
    this.keysFile.write(this.keys)
    return deletedKey
  }

  public clear(): string[] {
    this.keys = []
    this.keysFile.write(this.keys)
    return this.keys
  }
}

export default Keys
