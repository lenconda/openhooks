var Router = require('../utils/routers');
var uuidv4 = require('uuid/v4');
var { routersFile } = require('../utils/constants');

var add = function (desc, cmd, auth) {
  try {
    var id = uuidv4();
    var routers = new Router(routersFile);
    routers.add({
      id,
      desc: desc || '',
      command: cmd || '',
      auth: auth || false
    });
    return id;
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports = add;
