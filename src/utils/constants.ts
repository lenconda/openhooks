import os from 'os'
import path from 'path'

export const openhooksDir = path.resolve(os.homedir(), './.openhooks')
export const routersFile = path.resolve(openhooksDir, './routers.json')
export const keysFile = path.resolve(openhooksDir, './keys.json')
