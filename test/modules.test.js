var { expect } = require('chai');
var { del, clear } = require('../modules/del');
var add = require('../modules/add');
var ls = require('../modules/ls');

describe('modules', function () {

  describe('.add()', function () {
    it('should return a string of ID', function () {
      var desc = 'test';
      var cmd = 'test';
      var id = add(desc, cmd);
      expect(id).to.be.a('string');
    });
  });

  describe('.ls()', function () {
    it('should return an array', function () {
      var results = ls();
      expect(results).to.be.an('array');
    });
  });

  describe('.del.del()', function () {
    it('should return a string of path', function () {
      var result = del(0);
      expect(result).to.be.a('string');
    });
    it('should be one route in list', function () {
      var routerList = require('../server/routers.json');
      expect(routerList.length).to.be.equal(1);
    });
  })

  describe('.del.clear()', function () {
    it('should clear all the content of the list', function () {
      var result = clear();
      expect(result.length).to.be.equal(0);
    });
  });

});
