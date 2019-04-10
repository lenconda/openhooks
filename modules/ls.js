var Routers = require('../utils/routers');

var routers = new Routers(__dirname, '../server/routers.json');
var routes = routers.get();

var ls = function () {
  console.log('Total: ' + routes.length);
  console.table(routes);
}

module.exports = ls;
