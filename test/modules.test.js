var { expect } = require('chai');
var { del, clear } = require('../modules/del');
var add = require('../modules/add');
var path = require('path');
var ls = require('../modules/ls');
var { readFileSync } = require('fs');

describe('modules', function () {

  describe('.add()', function () {
    it('should return a string of ID', function () {
      var desc = 'test';
      var cmd = 'test';
      var auth = false;
      var id = add(desc, cmd, auth);
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
    it('should be no route in list', function () {
      del(0);
      var routerList = JSON.parse(readFileSync(path.resolve(__dirname, '../server/routers.json'), { encoding: 'utf-8' }));
      expect(routerList.length).to.be.equal(0);
    });
  })

  describe('.del.clear()', function () {
    it('should clear all the content of the list', function () {
      var result = clear();
      expect(result.length).to.be.equal(0);
    });
  });

});
