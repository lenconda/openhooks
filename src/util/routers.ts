import uuidv4 from 'uuid/v4'
import RoutersEntity from '../database/entity/routers'
import { getConnection } from '../database/connections'
import { Repository } from 'typeorm'

export interface RoutersModel {
  uuid: string
  description: string
  command: string
  createTime: string
  updateTime: string
  auth: boolean
}

export interface WebhookRouterBase {
  desc: string
  command: string
  auth: boolean
}

export interface WebhookRouter extends WebhookRouterBase {
  createTime: number
  updateTime: number
}

export interface WebhookRouterItem extends WebhookRouter {
  path: string
}

export interface WebhookUpdate {
  desc?: string
  updateCmd?: string
  auth?: string
}

class Routers {
  async find(id: string): Promise<WebhookRouterItem | null> {
    return new Promise<WebhookRouterItem>(async (resolve, reject) => {
      const connection = await getConnection()
      try {
        const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
        const findResult: RoutersModel = await routersModel.findOne(<any>{ uuid: id })
        const { uuid, description, command, createTime, auth, updateTime } = findResult
        const result: WebhookRouterItem = {
          path: `/hooks/${uuid}`,
          desc: description,
          auth,
          command,
          createTime: parseInt(createTime) || null,
          updateTime: parseInt(updateTime) || null
        }
        await connection.close()
        resolve(result)
      } catch (e) {
        await connection.close()
        resolve(null)
      }
    })
  }

  async delete(id: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const connection = await getConnection()
      const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
      const result = await routersModel.findOne(<any>{ uuid: id })
      await routersModel.remove(result)
      await connection.close()
      resolve(id)
    })
  }

  async add(route: WebhookRouterBase): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const connection = await getConnection()
      const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
      const generatedUuid = uuidv4()
      .split('-')
      .join('')
      const newRouter = new RoutersEntity()
      newRouter.uuid = generatedUuid
      newRouter.description = route.desc
      newRouter.command = route.command
      newRouter.createTime = Date.parse(new Date().toString()).toString()
      newRouter.updateTime = null
      newRouter.auth = route.auth
      await routersModel.save(<any>newRouter)
      await connection.close()
      resolve(generatedUuid)
    })
  }

  async get(): Promise<WebhookRouterItem[]> {
    return new Promise<WebhookRouterItem[]>(async (resolve, reject) => {
      const connection = await getConnection()
      const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
      const rows: RoutersModel[] = await routersModel.find()
      const result = rows.map((value, index): WebhookRouterItem => {
        const { uuid, description, command, createTime, updateTime, auth } = value
        return {
          path: `/hooks/${uuid}`,
          desc: description,
          command,
          createTime: parseInt(createTime) || null,
          updateTime: parseInt(updateTime) || null,
          auth
        }
      })
      await connection.close()
      resolve(result)
    })
  }

  async clear(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      const connection = await getConnection()
      const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
      await routersModel.clear()
      await connection.close()
      resolve([])
    })
  }

  async update(id: string, updates: WebhookUpdate): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const connection = await getConnection()
      const routersModel: Repository<any> = await connection.getRepository(RoutersEntity)
      const result = await routersModel.findOne(<any>{ uuid: id })
      const { description, auth, command } = result
      const updatePart = {
        description: updates.desc || description,
        auth: updates.auth === undefined ? auth : JSON.parse(updates.auth),
        command: updates.updateCmd || command,
        updateTime: Date.parse(new Date().toString()).toString()
      }
      await routersModel.update(<any>{ uuid: id }, <any>updatePart)
      await connection.close()
      resolve(id)
    })
  }
}

export default Routers
