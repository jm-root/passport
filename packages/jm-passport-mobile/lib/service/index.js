const event = require('jm-event')
const MS = require('jm-ms')
const ms = new MS()
const consts = require('../consts')
const t = require('../locale')

class Passport {
  constructor (opts = {}) {
    event.enableEvent(this)
    this.ready = true
    this.t = t
    this.config = opts
    this.gateway = opts.gateway
    this.captchaKeyPrefix = opts.captcha_key_prefix || consts.captchaKeyPrefix
    this.smsKeyPrefix = opts.sms_key_prefix || consts.smsKeyPrefix

    this.bind('sso')
    this.bind('user')
    this.bind('captcha')
    this.bind('verifycode')
    this.bind('sms')
  }

  async bind (name, uri) {
    uri || (uri = `/${name}`)
    let doc = await ms.client({ uri: this.gateway + uri })
    this[name] = doc
    return doc
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.once('ready', function () {
        resolve(self.ready)
      })
    })
  }

  async getSms (mobile, opts) {
    let config = this.config
    let captchaKeyPrefix = this.captchaKeyPrefix
    let smsKeyPrefix = this.smsKeyPrefix

    if (!config.disable_captcha) {
      await this.verifycode.get(`/${captchaKeyPrefix}${opts.key}/check`, opts)
    }

    let doc = await this.verifycode.get(`/${smsKeyPrefix}${mobile}?reuse=1`)
    doc = await this.sms.get('/send', {
      PhoneNumbers: mobile,
      SignName: config.sign_name,
      TemplateCode: config.template_code,
      TemplateParam: '{"code":"' + doc.code + '"}'
    })
    return doc
  }

  async verifySmsCode (mobile, opts) {
    let smsKeyPrefix = this.smsKeyPrefix
    let doc = await this.verifycode.get(`/${smsKeyPrefix}${mobile}/check`, opts)
    return doc
  }
}

module.exports = Passport
