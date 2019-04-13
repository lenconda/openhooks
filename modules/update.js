var Routers = require('../utils/routers');
var { routersFile } = require('../utils/constants');

var routers = new Routers(routersFile);

var update = function (index, desc, cmd, auth) {
  try {
    var result = routers.update(index, desc, cmd, auth);
    console.log('Updated webhook: ' + result);
  } catch (e) {
    throw e;
  }
}

module.exports = update;
