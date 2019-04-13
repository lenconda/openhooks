var pathExists = require('path-exists');
var fs = require('fs');
var fsExtra = require('fs-extra');
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
    fsExtra.mkdirp(openhooksDir, function (err) {
      if (err) throw err;
      initializeFIle(keysFile);
      initializeFIle(routersFile);
    });
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
