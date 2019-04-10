var path = require('path');
var { writeFileSync } = require('fs');

class Routers {

  constructor (directory, routers) {
    this.path = path.resolve(directory, routers);
    this.routers = require(this.path);
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
    writeFileSync(this.path, JSON.stringify(this.routers), { encoding: 'utf-8' });
  }

  add (route) {
    this.routers.push(route);
    writeFileSync(this.path, JSON.stringify(this.routers), { encoding: 'utf-8' });
  }

  get () {
    return this.routers;
  }

}

module.exports = Routers;
