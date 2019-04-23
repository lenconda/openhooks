import uuidv4 from 'uuid/v4'
import Database from '../utils/database'
import { databaseFile } from '../utils/constants'

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

class Routers extends Database {
  constructor(routersFilePath: string) {
    super(routersFilePath)
  }

  async find(id: string): Promise<WebhookRouterItem> {
    return new Promise<WebhookRouterItem>(async (resolve, reject) => {
      try {
        const {
          uuid,
          description,
          command,
          create_time,
          auth,
          update_time
        } = await this.dbGet(`SELECT * FROM oh_routers WHERE uuid = $id`, {
          $id: id
        })
        const result: WebhookRouterItem = {
          path: `/hooks/${uuid}`,
          desc: description,
          auth: auth === 1 ? true : false,
          command,
          createTime: parseInt(create_time) || null,
          updateTime: parseInt(update_time) || null
        }
        resolve(result)
      } catch (e) {
        resolve(null)
      }
    })
  }

  async delete(id: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      await this.dbRun('DELETE FROM oh_routers WHERE uuid = $id', { $id: id })
      resolve(id)
    })
  }

  async add(route: WebhookRouterBase): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const generatedUuid = uuidv4()
        .split('-')
        .join('')
      await this.dbRun(
        'INSERT INTO oh_routers(uuid, description, command, create_time, update_time, auth) VALUES (?, ?, ?, ?, ?, ?)',
        [
          generatedUuid,
          route.desc,
          route.command,
          Date.parse(new Date().toString()),
          null,
          route.auth
        ]
      )
      resolve(generatedUuid)
    })
  }

  async get(): Promise<WebhookRouterItem[]> {
    return new Promise<WebhookRouterItem[]>(async (resolve, reject) => {
      const rows = await this.dbAll('SELECT * FROM oh_routers')
      const result = rows.map(
        (value, index): WebhookRouterItem => {
          const {
            uuid,
            description,
            command,
            create_time,
            update_time,
            auth
          } = value
          return {
            path: `/hooks/${uuid}`,
            desc: description,
            command,
            createTime: parseInt(create_time) || null,
            updateTime: parseInt(update_time) || null,
            auth: auth === 1 ? true : false
          }
        }
      )
      resolve(result)
    })
  }

  async clear(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      await this.dbRun(`DELETE FROM oh_routers`)
      resolve([])
    })
  }

  async update(id: string, updates: WebhookUpdate): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const result = await this.dbGet(
        'SELECT * FROM oh_routers WHERE uuid = $id',
        { $id: id }
      )
      const { description, auth, command } = result
      await this.dbRun(
        `UPDATE oh_routers SET description = ?, auth = ?, command = ?, update_time = ? WHERE uuid = ?`,
        [
          updates.desc || description,
          updates.auth === undefined ? auth : JSON.parse(updates.auth),
          updates.updateCmd || command,
          Date.parse(new Date().toString()),
          id
        ]
      )
      resolve(id)
    })
  }
}

export default Routers
