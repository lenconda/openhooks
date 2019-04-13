var pathExists = require('path-exists');
var fs = require('fs');
var {
  openhooksDir,
  keysFile,
  routersFile } = require('../utils/constants');

var initializeFIle = function (path) {
  fs.writeFileSync(path, JSON.stringify([]), { encoding: 'utf-8' });
  return;
}

if (!pathExists.sync(openhooksDir)) {
  try {
    fs.mkdirSync(openhooksDir, {
      recursive: true,
      mode: '0755'
    });
    initializeFIle(keysFile);
    initializeFIle(routersFile);
  } catch (e) {
    throw e;
  }
} else {
  try {
    if (!pathExists.sync(keysFile))
      initializeFIle(keysFile);
    if (!pathExists.sync(routersFile))
      initializeFIle(routersFile);
  } catch (e) {
    throw e;
  }
}
