var Routers = require('../utils/routers');

var routers = new Routers(__dirname, '../server/routers.json');

var del = function (index) {
  if (routers.get()[index]) {
    var path = '/hooks/' + routers.get()[index].id;
    routers.delete(index);
    console.log('Deleted ' + path);
    return path;
  } else
    console.log('ID not found...');
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
