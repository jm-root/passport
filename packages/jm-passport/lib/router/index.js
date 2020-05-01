const { ms } = require('jm-server')

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

module.exports = function (service) {
  const router = ms.router()

  router
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
