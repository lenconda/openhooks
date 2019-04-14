import Routers from '../utils/routers'
import uuidv4 from 'uuid/v4'
import { routersFile } from '../utils/constants'

interface ListItem {
  path: string
  description: string
  command: string
  auth: boolean
}

export function add (desc: string, cmd: string, auth: string): string {
  try {
    let id = uuidv4()
    let routers = new Routers(routersFile)
    routers.add({
      id, desc: desc || '',
      command: cmd || '',
      auth: (JSON.parse(auth) === true ? true : false) || false })
    return id
  } catch (e) {
    throw e
  }
}

export function del (index: number): string {
  try {
    let routers = new Routers(routersFile)
    let id = routers.delete(index)
    return `/hooks/${id}`
  } catch (e) {
    throw e
  }
}

export function clear (): any[] {
  try {
    let routers = new Routers(routersFile)
    return  routers.clear()
  } catch (e) {
    throw e
  }
}

export function ls (): ListItem[] {
  let routers = new Routers(routersFile)
  return routers.get().map((value, index) => {
    return {
      path: `/hooks/${value.id}`,
      description: value.desc,
      command: value.command,
      auth: value.auth
    }
  })
}

export function update (
  index: number, desc: string, cmd: string, auth: string): string {
  try {
    let routers = new Routers(routersFile)
    return routers.update(index, desc, cmd, auth)
  } catch (e) {
    throw e
  }
}
