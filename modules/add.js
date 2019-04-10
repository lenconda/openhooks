var Router = require('../utils/routers');
var routersList = require('../server/routers.json');
var uuidv4 = require('uuid/v4');
var { writeFileSync } = require('fs');
var path = require('path');

var add = function (desc, cmd) {
  try {
    var id = uuidv4();
    var routers = new Router(routersList);
    var newRoutes = routers.add({
      id,
      desc: desc || '',
      command: cmd || ''
    });
    writeFileSync(
      path.resolve(__dirname, '../server/routers.json'),
      JSON.stringify(newRoutes), { encoding: 'utf-8' });
    console.log('Added /hooks/' + id);
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports = add;
