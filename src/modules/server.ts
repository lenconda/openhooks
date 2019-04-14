import path from 'path'

class Server {

  constructor (port: string | number) {
    this.daemon = require('daemonize2').setup({
      main: path.resolve(__dirname, '../server/app/app.js'),
      name: 'OpenHooks Server',
      pidfile: 'openhooks.pid',
      argv: [port]
    })
    this.port = port
  }

  private daemon: any
  private port: string | number

  public start (): void {
    console.log(`Listening at port ${this.port}`)
    this.daemon.start()
  }

  public stop (): void {
    this.daemon.stop()
  }

  public restart (): void {
    let _this = this
    this.daemon.stop()
    this.daemon.on('stopped', () => _this.daemon.start())
  }

}

export default Server
