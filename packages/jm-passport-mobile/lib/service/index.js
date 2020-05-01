const { Service } = require('jm-server')
const consts = require('../consts')
const t = require('../locale')
const { arg2bool } = require('jm-utils')

module.exports = class extends Service {
  constructor (opts = {}) {
    super(opts)
    let v = ['disable_captcha']
    v.forEach(function (key) {
      const value = opts[key]
      value !== undefined && (opts[key] = arg2bool(value))
    })

    this.t = t
    this.config = opts
    this.captchaKeyPrefix = opts.captcha_key_prefix || consts.captchaKeyPrefix
    this.smsKeyPrefix = opts.sms_key_prefix || consts.smsKeyPrefix

    const { gateway } = opts
    require('./gateway')({ gateway })
      .then(doc => {
        this.gateway = doc
        doc.bind('sso')
        doc.bind('user')
        doc.bind('captcha')
        doc.bind('verifycode')
        doc.bind('sms')
        this.emit('ready')
      })
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }

  async getSms (mobile, opts = {}) {
    const { verifycode, sms } = this.gateway
    let config = this.config
    let captchaKeyPrefix = this.captchaKeyPrefix
    let smsKeyPrefix = this.smsKeyPrefix

    if (!config.disable_captcha) {
      await verifycode.get(`/${captchaKeyPrefix}${opts.key}/check`, opts)
    }

    let doc = await verifycode.get(`/${smsKeyPrefix}${mobile}?reuse=1`)
    const {
      sign_name: SignName = config.sign_name,
      template_code: TemplateCode = config.template_code
    } = opts
    doc = await sms.get('/send', {
      PhoneNumbers: mobile,
      SignName,
      TemplateCode,
      TemplateParam: '{"code":"' + doc.code + '"}'
    })
    return doc
  }

  async verifySmsCode (mobile, opts) {
    const { verifycode } = this.gateway
    let smsKeyPrefix = this.smsKeyPrefix
    let doc = await verifycode.get(`/${smsKeyPrefix}${mobile}/check`, opts)
    return doc
  }
}
