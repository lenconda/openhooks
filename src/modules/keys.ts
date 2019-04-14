import Keys from '../utils/keys'
import { keysFile } from '../utils/constants'

interface KeyItem {
  key: string
}

export function generate (): string {
  try {
    let keys = new Keys(keysFile)
    return keys.generate()
  } catch (e) {
    throw e
  }
}

export function ls (): KeyItem[] {
  try {
    let keys = new Keys(keysFile)
    return keys.get().map((value, index) => {
      return {
        key: value
      }
    })
  } catch (e) {
    throw e
  }
}

export function remove (idx: number): string {
  try {
    let keys = new Keys(keysFile)
    return keys.remove(idx)
  } catch (e) {
    throw e
  }
}

export function clear (): string[] {
  try {
    let keys = new Keys(keysFile)
    return keys.clear()
  } catch (e) {
    throw e
  }
}
