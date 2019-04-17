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

  get(): string[] {
    return this.keys
  }

  generate(): string {
    const key = uuidv1()
      .split('-')
      .join('')
    this.keys.push(key)
    this.keysFile.write(this.keys)
    return key
  }

  remove(idx: number): string {
    const deletedKey = this.keys[idx]
    this.keys = this.keys.filter((value, index) => idx !== index)
    this.keysFile.write(this.keys)
    return deletedKey
  }

  clear(): string[] {
    this.keys = []
    this.keysFile.write(this.keys)
    return this.keys
  }
}

export default Keys
