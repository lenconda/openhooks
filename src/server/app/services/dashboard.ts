import { Service } from 'typedi'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError } from 'routing-controllers'
import md5 from 'md5'
import { getManager, Repository } from 'typeorm'
import AdminEntity from '../../../database/entity/admin'
import LogsEntity from '../../../database/entity/logs'
import jwt from 'jsonwebtoken'
import { fetchWithPagination, hasNext } from '../../util/pagination'

@Service()
export default class DashboardService {
  constructor() {
    this.adminModel = getManager().getRepository(AdminEntity)
    this.logsModel = getManager().getRepository(LogsEntity)
  }

  private adminModel: Repository<AdminEntity>
  private logsModel: Repository<LogsEntity>

  async login(username: string, password: string): Promise<string> {
    const result =
        await this.adminModel.findOne({ username, password: md5(password) })
    if (result) {
      const payload = { id: result.uuid.toString() }
      return jwt.sign(
          payload, 'openhooks', { expiresIn: '1day' })
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
      throw new NotFoundError(`User with UUID: ${userId} not found`)
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
        throw new BadRequestError('Old password does not match')
    await this.adminModel.update({ uuid: userId }, adminEntity)
    return `Updated profile for user ${username}(${userId})`
  }

  async getHitories(page: number) {
    const result = await fetchWithPagination(page, this.logsModel)
    const next = await hasNext<LogsEntity>(page, this.logsModel)
    return { items: result, next }
  }

  async getHistoryById(id: string): Promise<LogsEntity> {
    const result = await this.logsModel.findOne({ uuid: id })
    return result
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
