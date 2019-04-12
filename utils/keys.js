var path = require('path');
var { writeFileSync, readFileSync } = require('fs');
var uuidv1 = require('uuid/v1');

class Keys {

  constructor (directory, keys) {
    this.path = path.resolve(directory, keys);
    this.keys = this.readJson();
  }

  readJson () {
    return JSON.parse(readFileSync(this.path, { encoding: 'utf-8' }));
  }

  writeJson (data) {
    writeFileSync(this.path, JSON.stringify(data), { encoding: 'utf-8' });
  }

  get () {
    return this.keys;
  }

  generate () {
    var key = uuidv1().split('-').join('');
    this.keys.push(key);
    this.writeJson(this.keys);
    return key;
  }

  remove (idx) {
    var deletedKey = this.keys[idx];
    this.keys = this.keys.filter(function (value, index) {
      return parseInt(idx) !== index;
    });
    this.writeJson(this.keys);
    return deletedKey;
  }

  clear () {
    this.keys = [];
    this.writeJson(this.keys);
    return this.keys;
  }

}

module.exports = Keys;
