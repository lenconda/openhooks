import { expect } from 'chai'
import Routers from '../src/utils/routers'
import { openhooksDir, routersFile, keysFile } from '../src/utils/constants'
import Initializer from '../src/utils/initializer'

new Initializer(openhooksDir, keysFile, routersFile).run()

describe('Routers', () => {
  it('should be a class', () => {
    const routers = new Routers(routersFile)
    expect(routers).to.be.instanceOf(Routers)
  })

  describe('Routers.add', () => {
    it('should insert a route object to routers file', () => {
      const routers = new Routers(routersFile)
      const id = routers.add({ desc: 'test', command: 'test', auth: false })
      expect(new Routers(routersFile).get()[0].id).to.be.equal(id)
    })
  })

  describe('Routers.get', () => {
    it('should be a function', () => {
      const routers = new Routers(routersFile)
      expect(routers.get).to.be.a('function')
    })

    it('should return an array of routers', () => {
      const routers = new Routers(routersFile)
      expect(routers.get()).to.be.an('array')
    })
  })

  describe('Routers.update', () => {
    it('should be a function', () => {
      const routers = new Routers(routersFile)
      expect(routers.update).to.be.a('function')
    })

    it('should update the specified router', () => {
      const routers = new Routers(routersFile)
      routers.update(0, 'desc', 'cmd', 'true')
      expect(routers.get()[0].desc).to.be.equal('desc')
      expect(routers.get()[0].command).to.be.equal('cmd')
      expect(routers.get()[0].auth).to.be.equal(true)
    })
  })

  describe('Routers.delete', () => {
    it('should be a function', () => {
      const routers = new Routers(routersFile)
      expect(routers.delete).to.be.a('function')
    })

    it('should delete the specified router', () => {
      const routers = new Routers(routersFile)
      routers.add({ desc: 'del', command: 'del', auth: true })
      const currentLength = routers.get().length
      const id = routers.get()[currentLength - 1].id
      const deletedId = routers.delete(currentLength - 1)
      expect(routers.get().length).to.be.equal(currentLength - 1)
      expect(id).to.be.equal(deletedId)
    })
  })

  describe('Routers.clear', () => {
    it('should be a function', () => {
      const routers = new Routers(routersFile)
      expect(routers.clear).to.be.a('function')
    })

    it('should clear all routers', () => {
      const routers = new Routers(routersFile)
      routers.clear()
      expect(new Routers(routersFile).get().length).to.be.equal(0)
    })
  })
})
