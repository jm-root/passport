const log = require('jm-log4js')
const { EventEmitter } = require('jm-event')
const t = require('locale')

const logger = log.getLogger('main')

class Service extends EventEmitter {
  constructor (opts = {}) {
    super({ async: true })
    this.onReady()

    const { gateway, debug, app } = opts
    debug && (logger.setLevel('debug'))

    Object.assign(this, { app, logger, t })

    if (gateway) {
      require('./gateway')({ gateway })
        .then(doc => { this.gateway = doc })
    }
  }

  async onReady () {
    if (this.ready) return
    return new Promise(resolve => {
      this.once('ready', () => {
        this.ready = true
        resolve()
      })
    })
  }
}

module.exports = Service
