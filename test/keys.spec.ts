import { expect } from 'chai'
import Keys from '../src/utils/keys'
import { keysFile } from '../src/utils/constants'

describe('Keys', function () {

  it('should be a class', function () {
    var keys = new Keys(keysFile)
    expect(keys).to.be.instanceOf(Keys)
  })

  describe('Keys.get', function () {

    it('should be a function', function () {
      var keys = new Keys(keysFile)
      expect(keys.get).to.be.a('function')
    })

    it('should return an array of keys', function () {
      var keys = new Keys(keysFile)
      expect(keys.get()).to.be.an('array')
    })

  })

  describe('Keys.generate', function () {

    it('should be a function', function () {
      var keys = new Keys(keysFile)
      expect(keys.generate).to.be.a('function')
    })

    it('should add a string to keys file', function () {
      var keys = new Keys(keysFile)
      var key = keys.generate()
      expect(new Keys(keysFile).get().length).to.be.equal(1)
      expect(new Keys(keysFile).get()[0]).to.be.equal(key)
    })

  })

  describe('Keys.remove', function () {

    it('should be a function', function () {
      var keys = new Keys(keysFile)
      expect(keys.remove).to.be.a('function')
    })

    it('should remove a specified key', function () {
      var key = new Keys(keysFile).generate()
      var currentLength = new Keys(keysFile).get().length
      var removedKey = new Keys(keysFile).remove(currentLength - 1)
      expect(key).to.be.equal(removedKey)
      expect(new Keys(keysFile).get().length).to.be.equal(currentLength - 1)
    })

  })

  describe('Keys.clear', function () {

    it('should be a function', function () {
      var keys = new Keys(keysFile)
      expect(keys.clear).to.be.a('function')
    })

    it('should clear all keys', function () {
      new Keys(keysFile).clear()
      expect(new Keys(keysFile).get().length).to.be.equal(0)
    })

  })

})
