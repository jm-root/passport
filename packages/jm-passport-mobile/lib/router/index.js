const error = require('jm-err')
const { ms } = require('jm-server')

let Err = error.Err

module.exports = function (service) {
  const config = service.config
  const { captcha_key_prefix: captchaKeyPrefix = 'captcha:' } = config

  async function getCaptcha (opts) {
    const { verifycode, captcha } = service.gateway
    let key = opts.params.key
    let doc = await verifycode.get(`/${captchaKeyPrefix}${key}`)
    doc = await captcha.get(`/${doc.code}`)
    return doc
  }

  async function getSms (opts) {
    const mobile = opts.params.mobile || opts.data.mobile
    return service.getSms(mobile, opts.data)
  }

  async function verifySmsCode (opts) {
    const mobile = opts.params.mobile || opts.data.mobile
    return service.verifySmsCode(mobile, opts.data)
  }

  async function register (opts) {
    const { user } = service.gateway
    let ips = opts.ips || []
    ips.length || (ips = [opts.ip])
    const data = opts.data
    await verifySmsCode(opts)
    return user.request({ uri: '/signup', type: 'post', data, ips })
  }

  async function login (opts) {
    const { sso, user } = service.gateway
    let ips = opts.ips || []
    ips.length || (ips = [opts.ip])
    const { mobile, clientId } = opts.data
    await verifySmsCode(opts)
    const doc = await user.get(`/users/${mobile}/exists`)
    if (doc && !doc.ret) { throw error.err(Err.FA_NOTEXISTS) }
    const data = { id: doc.ret }
    clientId && (data.clientId = clientId)
    return sso.request('/signon', 'post', data, { ips })
  }

  async function resetPassword (opts) {
    const { user } = service.gateway
    const { data } = opts
    await verifySmsCode(opts)
    const doc = await user.get(`/users/${data.mobile}/exists`)
    if (doc && !doc.ret) { throw error.err(Err.FA_NOTEXISTS) }
    return user.post(`/users/${doc.ret}`, { password: data.password })
  }

  const router = ms.router()
  router
    .use('/register', register)
    .use('/login', login)
    .use('/resetPassword', resetPassword)
    .add('/captcha/:key', 'get', getCaptcha)
    .add('/sms/:mobile', 'get', getSms)
    .add('/sms/:mobile/verify', 'get', verifySmsCode)

  return router
}
