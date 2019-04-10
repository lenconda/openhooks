var path = require('path');

var daemon = require('daemonize2').setup({
  main: path.resolve(__dirname, '../server/bin/server.js'),
  name: 'OpenHooks Server',
  pidfile: 'server.pid'
});

module.exports = {

  start: function () {
    console.log('Listening at port ' + (process.env.OH_SERVER_PORT || '5000'));
    daemon.start();
  },

  stop: function () {
    daemon.stop();
  },

  restart: function () {
    daemon.stop();
    daemon.on('stopped', function () {
      daemon.start();
    });
  }

};
