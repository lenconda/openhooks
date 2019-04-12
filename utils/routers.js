var path = require('path');
var { writeFileSync, readFileSync } = require('fs');

class Routers {

  constructor (directory, routers) {
    this.path = path.resolve(directory, routers);
    this.routers = this.readJson();
  }

  readJson () {
    return JSON.parse(readFileSync(this.path, { encoding: 'utf-8' }));
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

  update (index, desc, updatedCmd, auth) {
    this.routers[index].desc = desc || this.routers[index].desc;
    this.routers[index].command = updatedCmd || this.routers[index].command;
    this.routers[index].auth = auth === undefined ? this.routers[index].auth : JSON.parse(auth);
    this.writeJson(this.routers);
    return this.routers[index].id;
  }

}

module.exports = Routers;
