import uuidv4 from 'uuid/v4'
import JSONFile from '../utils/json_file'

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
    this.routersFile = new JSONFile(this.path)
    this.routers = this.routersFile.read()
  }

  private path: string
  private routers: WebhookRouterItem[]
  private routersFile: JSONFile

  public find (id: string): WebhookRouterItem {
    return this.routers.filter(
      (value, index) => value.id === id).pop()
  }

  public delete (idx: number): string {
    let id = this.routers[idx].id
    this.routers = this.routers.filter((value, index) => idx !== index)
    this.routersFile.write(this.routers)
    return id
  }

  public add (route: WebhookRouter): string {
    let id = uuidv4()
    this.routers.push({ ...route, id })
    this.routersFile.write(this.routers)
    return id
  }

  public get (): WebhookRouterItem[] {
    return this.routers
  }

  public clear (): WebhookRouterItem[] {
    this.routers = []
    this.routersFile.write(this.routers)
    return this.routers
  }

  public update (index: number, desc: string, updatedCmd: string, auth: string): string {
    this.routers[index].desc = desc || this.routers[index].desc
    this.routers[index].command = updatedCmd || this.routers[index].command
    this.routers[index].auth = auth === undefined ? this.routers[index].auth : JSON.parse(auth)
    this.routersFile.write(this.routers)
    return this.routers[index].id
  }

}

export default Routers
