const event = require('jm-event')
const error = require('jm-err')
const help = require('./help')

const { ms } = require('jm-server')
let Err = error.Err

/**
 * @apiDefine Error
 *
 * @apiSuccess (Error 200) {Number} err 错误代码
 * @apiSuccess (Error 200) {String} msg 错误信息
 *
 * @apiExample {json} 错误:
 *     {
 *       err: 错误代码
 *       msg: 错误信息
 *     }
 */

module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()

  service.routes || (service.routes = {})
  let routes = service.routes
  event.enableEvent(routes)

  router.use(help(service))
    .use(function (opts) {
      if (!service.ready) {
        throw error.err(Err.FA_NOTREADY)
      }
    })
    .add('/register', 'post', async opts => {
      let ips = opts.ips || []
      ips.length || (ips = [opts.ip])
      let doc = await service.register(opts.data, ips)
      return doc
    })
    .add('/login', 'post', async opts => {
      let ips = opts.ips || []
      ips.length || (ips = [opts.ip])
      let doc = await service.login(opts.data, ips)
      return doc
    })

  return router
}
