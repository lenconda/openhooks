import { JsonController, Get, Param, Ctx } from 'routing-controllers'
import HooksService from '../services/hooks'
import { Inject } from 'typedi'
import { Context } from 'koa'

@JsonController('/hooks')
export default class HelloController {
  @Inject()
  service: HooksService

  @Get('/:id')
  hooks(@Param('id') id: string, @Ctx() context: Context) {
    return this.service.executeCommand(id, context)
  }
}
