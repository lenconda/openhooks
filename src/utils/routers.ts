import { writeFileSync, readFileSync } from 'fs'
import uuidv4 from 'uuid/v4'

export interface WebhookRouter {
  desc: string
  command: string
  auth: boolean
}

export interface WebhookRouterItem extends WebhookRouter {
  id: string
}

class Routers {

  constructor (routersFilePath: string) {
    this.path = routersFilePath
    this.routers = this.readJson()
  }

  private path: string
  private routers: WebhookRouterItem[]

  readJson () {
    return JSON.parse(
      readFileSync(this.path, { encoding: 'utf-8' }))
  }

  writeJson (data: WebhookRouterItem[]) {
    writeFileSync(
      this.path, JSON.stringify(data), { encoding: 'utf-8' })
  }

  find (id: string): WebhookRouterItem {
    return this.routers.filter(
      (value, index) => value.id === id).pop()
  }

  delete (idx: number): string {
    let id = this.routers[idx].id
    this.routers = this.routers.filter((value, index) => idx !== index)
    this.writeJson(this.routers)
    return id
  }

  add (route: WebhookRouter): string {
    let id = uuidv4()
    this.routers.push({ ...route, id })
    this.writeJson(this.routers)
    return id
  }

  get (): WebhookRouterItem[] {
    return this.routers
  }

  clear (): WebhookRouterItem[] {
    this.routers = []
    this.writeJson(this.routers)
    return this.routers
  }

  update (index: number, desc: string, updatedCmd: string, auth: string): string {
    this.routers[index].desc = desc || this.routers[index].desc
    this.routers[index].command = updatedCmd || this.routers[index].command
    this.routers[index].auth = auth === undefined ? this.routers[index].auth : JSON.parse(auth)
    this.writeJson(this.routers)
    return this.routers[index].id
  }

}

export default Routers
