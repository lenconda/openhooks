import os from 'os'
import path from 'path'

export const openhooksDir = path.resolve(os.homedir(), './.openhooks')
export const databaseFile = path.resolve(openhooksDir, './openhooks.db')
