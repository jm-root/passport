const event = require('jm-event')
const MS = require('jm-ms')
const error = require('jm-err')
let ms = new MS()

class Passport {
  constructor (opts = {}) {
    event.enableEvent(this)
    this.ready = true
    this.gateway = opts.gateway

    this.bind('sso')
    this.bind('user')
  }

  async bind (name, uri) {
    uri || (uri = `/${name}`)
    let doc = await ms.client({ uri: this.gateway + uri })
    this[name] = doc
    return doc
  }

  /**
   * 注册, 并返回注册信息
   * @param {Object} opts
   * @example
   * opts参数:{
   *  account: 账号
   *  password: 密码
   * }
   * @returns {Promise<*>}
   */
  async register (opts = {}, ips) {
    let self = this
    let doc = await self.user.request({ uri: '/users', type: 'post', data: opts, ips: ips })
    if (doc.err) throw error.err(doc)
    doc = {
      id: doc.id,
      uid: doc.uid
    }
    this.emit('register', doc)
    return doc
  }

  /**
   * 登陆
   * @param {Object} opts
   * @example
   * opts参数:{
   *  username: 账号
   *  password: 密码
   * }
   * @returns {Promise<*>}
   */
  async login (opts = {}, ips) {
    let self = this
    let doc = await self.user.request({ uri: '/signon', type: 'post', data: opts, ips: ips })
    if (doc.err) throw error.err(doc)
    doc = await self.sso.request({ uri: '/signon', type: 'post', data: doc, ips: ips })
    if (doc.err) throw error.err(doc)
    this.emit('login', { id: doc.id })
    return doc
  }
}

module.exports = Passport
