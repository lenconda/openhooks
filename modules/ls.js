var Routers = require('../utils/routers');

var routers = new Routers(__dirname, '../server/routers.json');
var routes = routers.get();

var ls = function () {
  return routes.map(function (value, index) {
    return {
      path: '/hooks/' + value.id,
      description: value.desc,
      command: value.command,
      auth: value.auth
    }
  });
}

module.exports = ls;
