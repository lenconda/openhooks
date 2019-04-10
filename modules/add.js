var Router = require('../utils/routers');
var uuidv4 = require('uuid/v4');

var add = function (desc, cmd) {
  try {
    var id = uuidv4();
    var routers = new Router(__dirname, '../server/routers.json');
    routers.add({
      id,
      desc: desc || '',
      command: cmd || ''
    });
    console.log('Added /hooks/' + id);
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports = add;
