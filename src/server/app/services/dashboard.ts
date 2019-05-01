import { Service } from 'typedi'
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError } from 'routing-controllers'
import md5 from 'md5'
import uuidv4 from 'uuid/v4'
import uuidv1 from 'uuid/v1'
import { getManager, Repository } from 'typeorm'
import AdminEntity from '../../../database/entity/admin'
import LogsEntity from '../../../database/entity/logs'
import RoutersEntity from '../../../database/entity/routers'
import KeysEntity from '../../../database/entity/keys'
import jwt from 'jsonwebtoken'
import { fetchWithPagination, hasNext, getPages } from '../../util/pagination'

@Service()
export default class DashboardService {
  constructor() {
    this.adminModel = getManager().getRepository(AdminEntity)
    this.logsModel = getManager().getRepository(LogsEntity)
    this.routersModel = getManager().getRepository(RoutersEntity)
    this.keysModel = getManager().getRepository(KeysEntity)
  }

  private adminModel: Repository<AdminEntity>
  private logsModel: Repository<LogsEntity>
  private routersModel: Repository<RoutersEntity>
  private keysModel: Repository<KeysEntity>

  async login(username: string, password: string): Promise<string> {
    try {
      const result =
          await this.adminModel.findOne({ username, password: md5(password) })
      if (result) {
        const payload = { id: result.uuid.toString() }
        return jwt.sign(
            payload, 'openhooks', { expiresIn: '1day' })
      } else
        throw new ForbiddenError('Login failed')
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getUserProfile(userId: string): Promise<UserInfo> {
    try {
      const result = await this.adminModel.findOne({ uuid: userId })
      if (result)
        return {
          uuid: result.uuid,
          username: result.username,
          updateTime: result.updateAt
        }
      else
        throw new NotFoundError(`User with UUID: ${userId} not found`)
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async updateUserProfile(userId: string, updates: UserInfoUpdate): Promise<string> {
    try {
      const { password, username } =
          await this.adminModel.findOne({ uuid: userId })
      const adminEntity = new AdminEntity()
      adminEntity.updateAt = Date.parse(new Date().toString()).toString()
      adminEntity.username = updates.username || username
      if (updates.password)
        if (md5(updates.password) === password)
          adminEntity.password = md5(updates.newPassword) || password
        else
          throw new BadRequestError('Old password does not match')
      await this.adminModel.update({ uuid: userId }, adminEntity)
      return `Updated profile for user ${username}(${userId})`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getHitories(page: number): Promise<Response<LogsEntity>> {
    try {
      const result = await fetchWithPagination(page, this.logsModel)
      const next = await hasNext<LogsEntity>(page, this.logsModel)
      const pages = await getPages<RoutersEntity>(this.routersModel)
      return { items: result, next, pages }
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getHistoryById(id: string): Promise<LogsEntity> {
    try {
      const result = await this.logsModel.findOne({ uuid: id })
      return result
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getHooks(page: number): Promise<Response<RoutersEntity>> {
    try {
      const result = await fetchWithPagination(page, this.routersModel)
      const next = await hasNext<RoutersEntity>(page, this.routersModel)
      const pages = await getPages<RoutersEntity>(this.routersModel)
      return { items: result, next, pages }
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getHookById(id: string): Promise<RoutersEntity> {
    try {
      const result = await this.routersModel.findOne({ uuid: id })
      return result
    } catch (e) {
      throw new InternalServerError(e)
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
      return `Added a new hook ${generatedUuid}`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async clearHooks(): Promise<string> {
    try {
      await this.routersModel.clear()
      return `Cleared all hooks`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async updateHook(id: string, updates: HookInfoUpdate): Promise<string> {
    try {
      const routersEntity = new RoutersEntity()
      if (updates.description)
        routersEntity.description = updates.description
      if (updates.command)
        routersEntity.command = updates.command
      if (updates.auth)
        routersEntity.auth = updates.auth
      routersEntity.updateTime = Date.parse(new Date().toString()).toString()
      await this.routersModel.update({ uuid: id }, routersEntity)
      return `Updated hook: ${id}`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async deleteHook(id: string): Promise<string> {
    try {
      await this.routersModel.delete({ uuid: id })
      return `Deleted hook: ${id}`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async addKey(): Promise<string> {
    try {
      const generatedKey = uuidv1().split('-').join('')
      const keysEntity = new KeysEntity()
      keysEntity.value = generatedKey
      keysEntity.createTime = Date.parse(new Date().toString()).toString()
      await this.keysModel.save(keysEntity)
      return `Add a new key: ${generatedKey}`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async clearKeys(): Promise<string> {
    try {
      await this.keysModel.clear()
      return `Cleared all keys`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async getKeys(page: number): Promise<Response<KeysEntity>> {
    try {
      const result = await fetchWithPagination(page, this.keysModel)
      const next = await hasNext<KeysEntity>(page, this.keysModel)
      const pages = await getPages<RoutersEntity>(this.routersModel)
      return { items: result, next, pages }
    } catch (e) {
      throw new InternalServerError(e)
    }
  }

  async deleteKey(value: string): Promise<string> {
    try {
      await this.keysModel.delete({ value })
      return `Deleted key: ${value}`
    } catch (e) {
      throw new InternalServerError(e)
    }
  }
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
