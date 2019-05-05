import {
  JsonController,
  Get,
  Authorized,
  Post,
  BodyParam,
  CurrentUser,
  Put,
  Body,
  Delete,
  QueryParam,
  Param } from 'routing-controllers'
import DashboardService, {
  HookInfoCreate,
  HookInfoUpdate,
  UserInfoUpdate,
  AuthInfo } from '../services/dashboard'
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
  @Put('/profile')
  async updateProfile(
      @CurrentUser() userId: string, @BodyParam('updates') updates: UserInfoUpdate) {
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

  @Authorized()
  @Get('/hooks')
  async getHooks(@QueryParam('page') page: number = 1) {
    const result = await this.service.getHooks(page)
    return result
  }

  @Authorized()
  @Post('/hooks')
  async addHook(@Body() body: HookInfoCreate) {
    const result = await this.service.addHook(body)
    return result
  }

  @Authorized()
  @Delete('/hooks')
  async clearHooks() {
    const result = await this.service.clearHooks()
    return result
  }

  @Authorized()
  @Get('/hook/:id')
  async getHookById(@Param('id') id: string) {
    const result = await this.service.getHookById(id)
    return result
  }

  @Authorized()
  @Put('/hook/:id')
  async updateHook(
      @Param('id') id: string,
      @BodyParam('updates') updates: HookInfoUpdate) {
    const result = await this.service.updateHook(id, updates)
    return result
  }

  @Authorized()
  @Delete('/hook/:id')
  async deleteHook(@Param('id') id: string) {
    const result = await this.service.deleteHook(id)
    return result
  }

  @Authorized()
  @Get('/keys')
  async getKeys(@QueryParam('page') page: number = 1) {
    const result = await this.service.getKeys(page)
    return result
  }

  @Authorized()
  @Post('/keys')
  async addKeys() {
    const result = await this.service.addKey()
    return result
  }

  @Authorized()
  @Delete('/keys')
  async deleteKeys() {
    const result = await this.service.clearKeys()
    return result
  }

  @Authorized()
  @Delete('/key/:value')
  async deleteKey(@Param('value') value: string) {
    const result = await this.service.deleteKey(value)
    return result
  }

  @Authorized()
  @Post('/auth/:hook')
  async setAuthToHook(@Param('hook') hook: string, @Body() auth: AuthInfo) {
    const result = await this.service.setAuthToHook(hook, auth.keys)
    return result
  }

  @Authorized()
  @Delete('/auth/:hook')
  async unsetAuthToHook(@Param('hook') hook: string, @Body() auth: AuthInfo) {
    const result = await this.service.unsetAuthToHook(hook, auth.keys)
    return result
  }
}
