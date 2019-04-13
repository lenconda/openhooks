var { expect } = require('chai');
var { routersFile } = require('../utils/constants');
var Routers = require('../utils/routers');
var uuidv4 = require('uuid/v4');

describe('Routers', function () {

  it('should be a class', function () {
    var routers = new Routers(routersFile);
    expect(routers).to.be.instanceOf(Routers);
  });

  describe('Routers.add', function () {

    it('should insert a route object to routers file', function () {
      var routers = new Routers(routersFile);
      var id = uuidv4();
      routers.add({ id, desc: 'test', command: 'test', auth: false });
      expect(new Routers(routersFile).get()[0].id).to.be.equal(id);
    });

  });

  describe('Routers.get', function () {

    it('should be a function', function () {
      var routers = new Routers(routersFile);
      expect(routers.get).to.be.a('function');
    });

    it('should return an array of routers', function () {
      var routers = new Routers(routersFile);
      expect(routers.get()).to.be.an('array');
    });

  });

  describe('Routers.update', function () {

    it('should be a function', function () {
      var routers = new Routers(routersFile);
      expect(routers.update).to.be.a('function');
    });

    it('should update the specified router', function () {
      var routers = new Routers(routersFile);
      routers.update(0, 'desc', 'cmd', true);
      expect(routers.get()[0].desc).to.be.equal('desc');
      expect(routers.get()[0].command).to.be.equal('cmd');
      expect(routers.get()[0].auth).to.be.equal(true);
    });

  });

  describe('Routers.delete', function () {

    it('should be a function', function () {
      var routers = new Routers(routersFile);
      expect(routers.delete).to.be.a('function');
    });

    it('should delete the specified router', function () {
      var routers = new Routers(routersFile);
      routers.add({ id: uuidv4(), desc: 'del', command: 'del', auth: true });
      var currentLength = routers.get().length;
      var id = routers.get()[currentLength - 1].id;
      var deletedId = routers.delete(currentLength - 1);
      expect(routers.get().length).to.be.equal(currentLength - 1);
      expect(id).to.be.equal(deletedId);
    });

  });

  describe('Routers.clear', function () {

    it('should be a function', function () {
      var routers = new Routers(routersFile);
      expect(routers.clear).to.be.a('function');
    });

    it('should clear all routers', function () {
      var routers = new Routers(routersFile);
      routers.clear();
      expect(new Routers(routersFile).get().length).to.be.equal(0);
    });

  });

});
