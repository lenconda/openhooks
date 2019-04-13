var os = require('os');
var path = require('path');

var openhooksDir = path.resolve(os.homedir(), './.openhooks');

module.exports.openhooksDir = openhooksDir;
module.exports.routersFile = path.resolve(openhooksDir, './routers.json');
module.exports.keysFile = path.resolve(openhooksDir, './keys.json');
