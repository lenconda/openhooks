var routersList = require('../server/routers.json');
var Routers = require('../utils/routers');

var routers = new Routers(routersList);
var routes = routers.get();

var ls = function () {
  console.log('Total: ' + routes.length);
  for (var i = 0; i < routes.length; i++) {
    console.log('[' + i + '] ' + '/hooks/' + routes[i].id + ' :|:|: ' + routes[i].command + ' :|:|: ' + routes[i].desc);
  }
}

module.exports = ls;
