const error = require('jm-err')
const help = require('./help')
const wrapper = require('jm-ms-wrapper')

let MS = require('jm-ms-core')
let ms = new MS()
let Err = error.Err

module.exports = function (opts = {}) {
  let service = this
  let config = service.config
  let captchaKeyPrefix = config.captcha_key_prefix || 'captcha:'

  let filterReady = async opts => {
    if (!service.ready) {
      throw error.err(Err.FA_NOTREADY)
    }
  }

  async function getCaptcha (opts) {
    let key = opts.params.key
    let doc = await service.verifycode.get(`/${captchaKeyPrefix}${key}`)
    doc = await service.captcha.get(`/${doc.code}`)
    return doc
  }

  async function getSms (opts) {
    let mobile = opts.params.mobile || opts.data.mobile
    let doc = await service.getSms(mobile, opts.data)
    return doc
  }

  async function verifySmsCode (opts) {
    let mobile = opts.params.mobile || opts.data.mobile
    let doc = await service.verifySmsCode(mobile, opts.data)
    return doc
  }

  async function register (opts) {
    let ips = opts.ips || []
    ips.length || (ips = [opts.ip])
    let data = opts.data
    await verifySmsCode(opts)
    let doc = await service.user.request({uri: '/signup', type: 'post', data, ips})
    return doc
  }

  async function login (opts) {
    let ips = opts.ips || []
    ips.length || (ips = [opts.ip])
    let data = opts.data
    await verifySmsCode(opts)
    let doc = await service.user.get(`/users/${data.mobile}/exists`)
    if (doc && !doc.ret) { throw error.err(Err.FA_NOTEXISTS) }
    doc = await service.sso.request('/signon', 'post', {id: doc.ret}, {ips})
    return doc
  }

  async function resetPassword (opts) {
    let data = opts.data
    await verifySmsCode(opts)
    let doc = await service.user.get(`/users/${data.mobile}/exists`)
    if (doc && !doc.ret) { throw error.err(Err.FA_NOTEXISTS) }
    doc = await service.user.post(`/users/${doc.ret}`, {password: data.password})
    return doc
  }

  let router = ms.router()
  wrapper(service.t)(router)
  router
    .use(help(service))
    .use(filterReady)
    .use('/register', register)
    .use('/login', login)
    .use('/resetPassword', resetPassword)
    .add('/captcha/:key', 'get', getCaptcha)
    .add('/sms/:mobile', 'get', getSms)
    .add('/sms/:mobile/verify', 'get', verifySmsCode)

  return router
}
