import uuidv1 from 'uuid/v1'
import KeysEntity from '../database/entity/keys'
import { getConnection } from '../database/connections'
import { Repository } from 'typeorm'

interface KeysResult {
  key: string
  createTime: number
}

class Keys {
  async get(): Promise<KeysResult[]> {
    return new Promise<KeysResult[]>(async (resolve, reject) => {
      const connection = await getConnection()
      const keysModel: Repository<any> = await connection.getRepository(KeysEntity)
      const results = await keysModel.find()
      await connection.close()
      resolve(results.map((value, index) => {
        return {
          key: value.value,
          createTime: parseInt(value.createTime)
        }
      }))
    })
  }

  async generate(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const connection = await getConnection()
      const keysModel: Repository<any> = await connection.getRepository(KeysEntity)
      const generatedKey = uuidv1()
        .split('-')
        .join('')
      const key = new KeysEntity()
      key.value = generatedKey
      key.createTime = Date.parse(new Date().toString()).toString()
      await keysModel.save<any>(key)
      await connection.close()
      resolve(generatedKey)
    })
  }

  async remove(value: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const connection = await getConnection()
      const keysModel: Repository<any> = await connection.getRepository(KeysEntity)
      const removedKey = await keysModel.findOne(<any>{ value: value })
      await keysModel.remove(removedKey)
      await connection.close()
      resolve(value)
    })
  }

  async clear(): Promise<[]> {
    return new Promise<[]>(async (resolve, reject) => {
      const connection = await getConnection()
      const keysModel: Repository<any> = await connection.getRepository(KeysEntity)
      await keysModel.clear()
      await connection.close()
      resolve([])
    })
  }
}

export default Keys
