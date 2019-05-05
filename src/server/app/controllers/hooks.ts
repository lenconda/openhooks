import {
  JsonController,
  Get,
  Param,
  Ctx,
  Post,
  QueryParam } from 'routing-controllers'
import HooksService from '../services/hooks'
import { Inject } from 'typedi'
import { Context } from 'koa'

@JsonController('/hooks')
export default class HelloController {
  @Inject()
  service: HooksService

  @Get('/:id')
  @Post('/:id')
  async hooks(
      @Param('id') id: string,
      @Ctx() context: Context,
      @QueryParam('callback') callback: string = 'access-key') {
    this.service.executeCommand(id, context, callback)
    return 'Hook is triggered, check logs to get result.'
  }
}
