import uuidv1 from 'uuid/v1'
import Database from '../utils/database'

interface KeysResult {
  key: string
  createTime: number
}

class Keys extends Database {
  constructor(keysFilePath: string) {
    super(keysFilePath)
  }

  async get(): Promise<KeysResult[]> {
    return new Promise<KeysResult[]>(async (resolve, reject) => {
      const results = await this.dbAll('SELECT * FROM oh_keys')
      resolve(
        results.map((value, index) => {
          return {
            key: value.value,
            createTime: parseInt(value.create_time)
          }
        })
      )
    })
  }

  async generate(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const generatedKey = uuidv1()
        .split('-')
        .join('')
      await this.dbRun(
        `INSERT INTO oh_keys(value, create_time) VALUES ($keyValue, $keyCreateTime)`,
        {
          $keyValue: generatedKey,
          $keyCreateTime: Date.parse(new Date().toString())
        }
      )
      resolve(generatedKey)
    })
  }

  async remove(value: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await this.dbRun(`DELETE FROM oh_keys WHERE value = "${value}"`)
      resolve(value)
    })
  }

  async clear(): Promise<any[]> {
    return new Promise<any[]>(async (resolve, reject) => {
      await this.dbRun(`DELETE FROM oh_keys`)
      resolve([])
    })
  }
}

export default Keys
