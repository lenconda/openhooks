var path = require('path');
var { writeFileSync } = require('fs');

class Routers {

  constructor (directory, routers) {
    this.path = path.resolve(directory, routers);
    this.routers = require(this.path);
  }

  writeJson (data) {
    writeFileSync(this.path, JSON.stringify(data), { encoding: 'utf-8' });
  }

  find (id) {
    return this.routers.filter(function (value, index) {
      return value.id === id;
    }).pop();
  }

  delete (idx) {
    this.routers = this.routers.filter(function (value, index) {
      return parseInt(idx) !== index;
    });
    this.writeJson(this.routers);
  }

  add (route) {
    this.routers.push(route);
    this.writeJson(this.routers);
  }

  get () {
    return this.routers;
  }

  clear () {
    this.routers = [];
    this.writeJson(this.routers);
    return this.routers;
  }

}

module.exports = Routers;
