var Routers = require('../utils/routers');

var routers = new Routers(__dirname, '../server/routers.json');

var del = function (id) {
  if (routers.get()[id]) {
    var path = '/hooks/' + routers.get()[id].id;
    routers.delete(id);
    console.log('Deleted ' + path);
  } else
    console.log('ID not found...');
}

module.exports = del;
