import os from 'os'
import path from 'path'

export const openhooksDir = path.resolve(os.homedir(), './.openhooks')
export const databaseFile = path.resolve(openhooksDir, './openhooks.db')
export const testDir = path.resolve(__dirname, '../../.test')
export const databaseTestFile = path.resolve(testDir, 'openhooks.db')
export const databaseSrcPath = path.resolve(__dirname, '../../openhooks.db')
