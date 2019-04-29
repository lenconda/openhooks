import { expect } from 'chai'
import Keys from '../src/util/keys'
import Initializer from '../src/util/initializer'

describe('Keys', () => {
  before(() => {
    console.log('Initializing...')
    new Initializer().run()
  })

  after(() => {
    console.log('Clearing...')
    new Initializer().clearTest()
  })

  it('should be a class', async () => {
    const keys = new Keys()
    expect(keys).to.be.instanceOf(Keys)
  })

  describe('Keys.get', () => {
    it('should be a function', async () => {
      const keys = new Keys()
      expect(keys.get).to.be.a('function')
    })

    it('should return an array of keys', async () => {
      const keys = new Keys()
      const rows = await keys.get()
      expect(rows).to.be.an('array')
    })
  })

  describe('Keys.generate', () => {
    it('should be a function', async () => {
      const keys = new Keys()
      expect(keys.generate).to.be.a('function')
    })

    it('should add a string to keys file', async () => {
      const keys = new Keys()
      const key = await keys.generate()
      const newKeysRows = await keys.get()
      expect(newKeysRows[newKeysRows.length - 1].key).to.be.equal(key)
    })
  })

  describe('Keys.remove', () => {
    it('should be a function', async () => {
      const keys = new Keys()
      expect(keys.remove).to.be.a('function')
    })

    it('should remove a specified key', async () => {
      const keys = new Keys()
      const generatedKey = await keys.generate()
      const currentKeysRows = await keys.get()
      const currentLength = currentKeysRows.length
      const removedKey = await keys.remove(generatedKey)
      const newKeysRows = await keys.get()
      expect(removedKey).to.be.equal(generatedKey)
      expect(newKeysRows.length).to.be.equal(currentLength - 1)
    })
  })

  describe('Keys.clear', () => {
    it('should be a function', async () => {
      const keys = new Keys()
      expect(keys.clear).to.be.a('function')
    })

    it('should clear all keys', async () => {
      const keys = new Keys()
      await keys.clear()
      const { length } = await keys.get()
      expect(length).to.be.equal(0)
    })
  })
})
