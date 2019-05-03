import { JsonController, Get, Param, Ctx, Post } from 'routing-controllers'
import HooksService from '../services/hooks'
import { Inject } from 'typedi'
import { Context } from 'koa'

@JsonController('/hooks')
export default class HelloController {
  @Inject()
  service: HooksService

  @Get('/:id')
  @Post('/:id')
  async hooks(@Param('id') id: string, @Ctx() context: Context) {
    this.service.executeCommand(id, context)
    return 'Hook actived, check logs to get result.'
  }
}
