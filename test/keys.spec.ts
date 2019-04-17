import { expect } from 'chai'
import Keys from '../src/utils/keys'
import Initializer from '../src/utils/initializer'
import { openhooksDir, routersFile, keysFile } from '../src/utils/constants'

new Initializer(openhooksDir, keysFile, routersFile).run()

describe('Keys', () => {
  it('should be a class', () => {
    const keys = new Keys(keysFile)
    expect(keys).to.be.instanceOf(Keys)
  })

  describe('Keys.get', () => {
    it('should be a function', () => {
      const keys = new Keys(keysFile)
      expect(keys.get).to.be.a('function')
    })

    it('should return an array of keys', () => {
      const keys = new Keys(keysFile)
      expect(keys.get()).to.be.an('array')
    })
  })

  describe('Keys.generate', () => {
    it('should be a function', () => {
      const keys = new Keys(keysFile)
      expect(keys.generate).to.be.a('function')
    })

    it('should add a string to keys file', () => {
      const keys = new Keys(keysFile)
      const key = keys.generate()
      expect(new Keys(keysFile).get().length).to.be.equal(1)
      expect(new Keys(keysFile).get()[0]).to.be.equal(key)
    })
  })

  describe('Keys.remove', () => {
    it('should be a function', () => {
      const keys = new Keys(keysFile)
      expect(keys.remove).to.be.a('function')
    })

    it('should remove a specified key', () => {
      const key = new Keys(keysFile).generate()
      const currentLength = new Keys(keysFile).get().length
      const removedKey = new Keys(keysFile).remove(currentLength - 1)
      expect(key).to.be.equal(removedKey)
      expect(new Keys(keysFile).get().length).to.be.equal(currentLength - 1)
    })
  })

  describe('Keys.clear', () => {
    it('should be a function', () => {
      const keys = new Keys(keysFile)
      expect(keys.clear).to.be.a('function')
    })

    it('should clear all keys', () => {
      new Keys(keysFile).clear()
      expect(new Keys(keysFile).get().length).to.be.equal(0)
    })
  })
})
