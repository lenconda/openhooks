import { expect } from 'chai'
import Routers, {
  WebhookRouterItem,
  WebhookRouterBase
} from '../src/utils/routers'
import { openhooksDir, databaseFile } from '../src/utils/constants'
import Initializer from '../src/utils/initializer'

new Initializer(openhooksDir, databaseFile).run(true)

describe('Routers', () => {
  it('should be a class', async () => {
    const routers = new Routers(databaseFile)
    expect(routers).to.be.instanceOf(Routers)
  })

  describe('Routers.add', () => {
    it('should insert a route object to routers file', async () => {
      const routers = new Routers(databaseFile)
      const id = await routers.add(<WebhookRouterBase>{
        desc: 'test',
        command: 'test',
        auth: false
      })
      const newRouters = await routers.get()
      expect(newRouters[0].path).to.be.equal(`/hooks/${id}`)
    })
  })

  describe('Routers.get', () => {
    it('should be a function', async () => {
      const routers = new Routers(databaseFile)
      expect(routers.get).to.be.a('function')
    })

    it('should return an array of routers', async () => {
      const routers = new Routers(databaseFile)
      expect(await routers.get()).to.be.an('array')
    })
  })

  describe('Routers.update', () => {
    it('should be a function', async () => {
      const routers = new Routers(databaseFile)
      expect(routers.update).to.be.a('function')
    })

    it('should update the specified router', async () => {
      const routers = new Routers(databaseFile)
      const id = await routers.add(<WebhookRouterBase>{
        desc: 'test',
        command: 'test',
        auth: false
      })
      await routers.update(id, {
        desc: 'desc',
        updateCmd: 'cmd',
        auth: 'true'
      })
      const newRouterItem = await routers.find(id)
      expect(newRouterItem.desc).to.be.equal('desc')
      expect(newRouterItem.command).to.be.equal('cmd')
      expect(newRouterItem.auth).to.be.equal(true)
    })
  })

  describe('Routers.delete', () => {
    it('should be a function', async () => {
      const routers = new Routers(databaseFile)
      expect(routers.delete).to.be.a('function')
    })

    it('should delete the specified router', async () => {
      const routers = new Routers(databaseFile)
      const createdId = await routers.add({
        desc: 'del',
        command: 'del',
        auth: true
      })
      const { length } = await routers.get()
      const currentRouters = await routers.get()
      const path = currentRouters[length - 1].path
      const deletedId = await routers.delete(createdId)
      const newRouters = await routers.get()
      expect(newRouters.length).to.be.equal(length - 1)
      expect(createdId).to.be.equal(deletedId)
    })
  })

  describe('Routers.clear', () => {
    it('should be a function', async () => {
      const routers = new Routers(databaseFile)
      expect(routers.clear).to.be.a('function')
    })

    it('should clear all routers', async () => {
      const routers = new Routers(databaseFile)
      await routers.clear()
      const { length } = await routers.get()
      expect(length).to.be.equal(0)
    })
  })
})
