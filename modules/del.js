var Routers = require('../utils/routers');

var routers = new Routers(__dirname, '../server/routers.json');

var del = function (index) {
  try {
    var id = routers.delete(index);
    var path = '/hooks/' + id;
    console.log('Deleted ' + path);
  } catch (e) {
    console.log('Webhook not found...');
  }
}

var clear = function () {
  try {
    let result = routers.clear();
    console.log('Cleared all webhooks');
    return result;
  } catch (e) {
    console.log(e.toString());
  }
}

module.exports.del = del;
module.exports.clear = clear;
