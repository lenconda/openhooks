import { Service } from 'typedi'
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError } from 'routing-controllers'
import md5 from 'md5'
import uuidv4 from 'uuid/v4'
import uuidv1 from 'uuid/v1'
import { getManager, Repository } from 'typeorm'
import AdminEntity from '../../../database/entity/admin'
import LogsEntity from '../../../database/entity/logs'
import RoutersEntity from '../../../database/entity/routers'
import KeysEntity from '../../../database/entity/keys'
import AuthsEntity from '../../../database/entity/auths'
import jwt from 'jsonwebtoken'
import { fetchWithPagination, hasNext, getPages } from '../../util/pagination'

@Service()
export default class DashboardService {
  constructor() {
    this.adminModel = getManager().getRepository(AdminEntity)
    this.logsModel = getManager().getRepository(LogsEntity)
    this.routersModel = getManager().getRepository(RoutersEntity)
    this.keysModel = getManager().getRepository(KeysEntity)
    this.authsModel = getManager().getRepository(AuthsEntity)
  }

  private adminModel: Repository<AdminEntity>
  private logsModel: Repository<LogsEntity>
  private routersModel: Repository<RoutersEntity>
  private keysModel: Repository<KeysEntity>
  private authsModel: Repository<AuthsEntity>

  async login(username: string, password: string): Promise<LoginInfo> {
    const result =
        await this.adminModel.findOne({ username, password: md5(password) })
    if (result) {
      const payload = { id: result.uuid.toString() }
      const token =  jwt.sign(
          payload, 'openhooks', { expiresIn: '1day' })
      return { token }
    } else
      throw new ForbiddenError('Login failed')
  }

  async getUserProfile(userId: string): Promise<UserInfo> {
    const result = await this.adminModel.findOne({ uuid: userId })
    if (result)
      return {
        uuid: result.uuid,
        username: result.username,
        updateTime: result.updateAt
      }
    else
      throw new UnauthorizedError(`User with UUID: ${userId} not found`)
  }

  async updateUserProfile(userId: string, updates: UserInfoUpdate): Promise<string> {
    const { password, username } =
        await this.adminModel.findOne({ uuid: userId })
    const adminEntity = new AdminEntity()
    adminEntity.updateAt = Date.parse(new Date().toString()).toString()
    adminEntity.username = updates.username || username
    if (updates.password)
      if (md5(updates.password) === password)
        adminEntity.password = md5(updates.newPassword) || password
      else
        throw new ForbiddenError('Old password does not match')
    await this.adminModel.update({ uuid: userId }, adminEntity)
    return `Updated profile for user ${username}(${userId})`
  }

  async getHitories(page: number): Promise<Response<LogsEntity>> {
    try {
      const result = await fetchWithPagination(page, this.logsModel)
      const next = await hasNext<LogsEntity>(page, this.logsModel)
      const pages = await getPages<LogsEntity>(this.logsModel)
      return { items: result, next, pages }
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async getHistoryById(id: string): Promise<LogsEntity> {
    try {
      const result = await this.logsModel.findOne({ uuid: id })
      return result
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async getHooks(page: number): Promise<Response<HookInfo>> {
    try {
      const result = await fetchWithPagination(page, this.routersModel)
      const next = await hasNext<RoutersEntity>(page, this.routersModel)
      const pages = await getPages<RoutersEntity>(this.routersModel)
      const items: HookInfo[] = []
      for (let item of result) {
        const keysResult = await this.authsModel.find({ hookId: item.uuid })
        const keys = keysResult.map((value, index) => value.key)
        const hook: HookInfo = { ...item, keys }
        items.push(hook)
      }
      return { items, next, pages }
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async getHookById(id: string): Promise<RoutersEntity> {
    try {
      const result = await this.routersModel.findOne({ uuid: id })
      return result
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async addHook(info: HookInfoCreate): Promise<string> {
    try {
      const routersEntity = new RoutersEntity()
      const generatedUuid = uuidv4().split('-').join('')
      routersEntity.uuid = generatedUuid
      routersEntity.description = info.description
      routersEntity.auth = info.auth
      routersEntity.command = info.command
      routersEntity.createTime = Date.parse(new Date().toString()).toString()
      await this.routersModel.save(routersEntity)
      return `Generated a new hook ${generatedUuid}`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async clearHooks(): Promise<string> {
    try {
      await this.routersModel.clear()
      return `Cleared all hooks`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async updateHook(id: string, updates: HookInfoUpdate): Promise<string> {
    try {
      const routersEntity = new RoutersEntity()
      if (updates.description)
        routersEntity.description = updates.description
      if (updates.command)
        routersEntity.command = updates.command
      if (updates.auth !== undefined)
        routersEntity.auth = updates.auth
      routersEntity.updateTime = Date.parse(new Date().toString()).toString()
      await this.routersModel.update({ uuid: id }, routersEntity)
      return `Updated hook: ${id}`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async deleteHook(id: string): Promise<string> {
    try {
      await this.routersModel.delete({ uuid: id })
      return `Deleted hook: ${id}`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async addKey(): Promise<string> {
    try {
      const generatedKey = uuidv1().split('-').join('')
      const keysEntity = new KeysEntity()
      keysEntity.value = generatedKey
      keysEntity.createTime = Date.parse(new Date().toString()).toString()
      await this.keysModel.save(keysEntity)
      return `Generated a new key: ${generatedKey}`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async clearKeys(): Promise<string> {
    try {
      await this.keysModel.clear()
      return `Cleared all keys`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async getKeys(page: number): Promise<Response<KeysEntity>> {
    try {
      const result = await fetchWithPagination(page, this.keysModel)
      const next = await hasNext<KeysEntity>(page, this.keysModel)
      const pages = await getPages<KeysEntity>(this.keysModel)
      return { items: result, next, pages }
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async deleteKey(value: string): Promise<string> {
    try {
      await this.keysModel.delete({ value })
      return `Deleted key: ${value}`
    } catch (e) {
      throw new InternalServerError(e.message)
    }
  }

  async setAuthToHook(hook: string, keys: string[]): Promise<string> {
    try {
      let length = keys.length
      for (let key of keys) {
        const authCount = await this.authsModel.count({ hookId: hook, key })
        const keyCount = await this.keysModel.count({ value: key })
        if (authCount !== 0) {
          length -= 1
          continue
        }
        if (keyCount === 0) {
          length -= 1
          continue
        }
        const authsEntity = new AuthsEntity()
        authsEntity.hookId = hook
        authsEntity.key = key
        authsEntity.createTime = Date.parse(new Date().toString()).toString()
        await this.authsModel.save(authsEntity)
      }

      return `Set ${length} key${length === 0 ? '' : 's'} to /hooks/${hook}`
    } catch (e) {
      throw e
    }
  }

  async unsetAuthToHook(hook: string, keys: string[]): Promise<string> {
    try {
      for (let key of keys)
        await this.authsModel.delete({ hookId: hook, key })
      return `Unset ${keys.length} key${keys.length === 1 ? '' : 's'} from /hooks/${hook}`
    } catch (e) {
      throw e
    }
  }
}

export interface LoginInfo {
  token: string
}

export interface UserInfo {
  uuid?: string
  username?: string
  updateTime?: string
}

export interface UserInfoUpdate extends UserInfo {
  password?: string
  newPassword?: string
}

export interface Response<T> {
  items: T[],
  next: boolean
  pages: number
}

export interface APIResponse<T> {
  status: number
  message: number
  data: Response<T>
}

export interface KeysInfo extends KeysEntity {}

export interface HistoriesInfo extends LogsEntity {}

export interface HookInfo extends RoutersEntity {
  keys: string[]
}

export interface HookInfoUpdate {
  description?: string
  command?: string
  auth?: boolean
}

export interface HookInfoCreate {
  description: string
  command: string
  auth: boolean
}

export interface AuthInfo {
  keys: string[]
}
