var path = require('path');

class Server {

  constructor (port) {
    this.daemon = require('daemonize2').setup({
      main: path.resolve(__dirname, '../server/bin/server.js'),
      name: 'OpenHooks Server',
      pidfile: 'openhooks.pid',
      argv: [port]
    });
    this.port = port;
  }

  start () {
    console.log('Listening at port ' + this.port);
    this.daemon.start();
  }

  stop () {
    this.daemon.stop();
  }

  restart () {
    var _this = this;
    this.daemon.stop();
    this.daemon.on('stopped', function () {
      _this.daemon.start();
    });
  }

}

module.exports = Server;
