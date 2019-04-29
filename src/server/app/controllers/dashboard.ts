import {
  JsonController,
  Get,
  Authorized,
  Post,
  BodyParam,
  CurrentUser,
  Put,
  QueryParam,
  Param } from 'routing-controllers'
import DashboardService, { UserInfoUpdate } from '../services/dashboard'
import { Inject } from 'typedi'

@JsonController('/api')
export default class DashboardController {
  @Inject()
  service: DashboardService

  @Post('/login')
  async login(@BodyParam('username') username: string,
              @BodyParam('password') password: string) {
    const result = await this.service.login(username, password)
    return result
  }

  @Authorized()
  @Get('/profile')
  async getProfile(@CurrentUser() userId: string) {
    const result = await this.service.getUserProfile(userId)
    return result
  }

  @Authorized()
  @Put('/update')
  async updateProfile(
      @CurrentUser() userId: string, updates: UserInfoUpdate) {
    const result = await this.service.updateUserProfile(userId, updates)
    return result
  }

  @Authorized()
  @Get('/histories')
  async getHistories(
      @QueryParam('page') page: number = 1) {
    const result = await this.service.getHitories(page)
    return result
  }

  @Authorized()
  @Get('/history/:id')
  async getHistoryById(@Param('id') id: string) {
    const result = await this.service.getHistoryById(id)
    return result
  }
}
