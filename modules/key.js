var Keys = require('../utils/keys');

var keys = new Keys(__dirname, '../server/keys.json');

var generate = function () {
  try {
    return keys.generate();
  } catch (e) {
    console.log(e.toString());
  }
}

var ls = function () {
  try {
    var results = keys.get();
    return results.map(function (value, index) {
      return {
        key: value
      };
    })
  } catch (e) {
    console.log(e.toString());
  }
}

var remove = function (idx) {
  try {
    return keys.remove(idx);
  } catch (e) {
    console.log(e.toString());
  }
}

var clear = function () {
  try {
    return keys.clear();
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports.gen = generate;
module.exports.ls = ls;
module.exports.del = remove;
module.exports.clear = clear;
