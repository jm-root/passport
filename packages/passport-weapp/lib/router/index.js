const { ms } = require('jm-server')

module.exports = function (service) {
  const router = ms.router()

  async function login (opts) {
    let { data, ips = [], ip } = opts
    ips.length || (ips = [ip])
    return service.login(data, ips)
  }

  async function loginByOpenid (opts) {
    let { params: { openid }, data: { clientId }, ips = [], ip } = opts
    ips.length || (ips = [ip])
    return service.loginByOpenid({ openid, clientId }, ips)
  }

  router
    .use('/login/:openid', loginByOpenid)
    .use('/login', login)
  return router
}
