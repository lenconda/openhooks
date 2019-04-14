import { writeFileSync, readFileSync } from 'fs'

export interface WebhookRouter {
  id: string
  desc: string
  command: string
  auth: boolean
}

class Routers {

  constructor (routersFilePath: string) {
    this.path = routersFilePath
    this.routers = this.readJson()
  }

  private path: string
  private routers: WebhookRouter[]

  readJson () {
    return JSON.parse(
      readFileSync(this.path, { encoding: 'utf-8' }))
  }

  writeJson (data: WebhookRouter[]) {
    writeFileSync(
      this.path, JSON.stringify(data), { encoding: 'utf-8' })
  }

  find (id: string): WebhookRouter {
    return this.routers.filter(
      (value, index) => value.id === id).pop()
  }

  delete (idx: number): string {
    let id = this.routers[idx].id
    this.routers = this.routers.filter((value, index) => idx !== index)
    this.writeJson(this.routers)
    return id
  }

  add (route: WebhookRouter): void {
    this.routers.push(route)
    this.writeJson(this.routers)
  }

  get (): WebhookRouter[] {
    return this.routers
  }

  clear (): WebhookRouter[] {
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
