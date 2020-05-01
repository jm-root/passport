const { Service } = require('jm-server')
const error = require('jm-err')

module.exports = class extends Service {
  constructor (opts = {}) {
    super(opts)
    const { gateway } = opts
    require('./gateway')({ gateway })
      .then(doc => {
        this.gateway = doc
        doc.bind('sso')
        doc.bind('user')
        this.emit('ready')
      })
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
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
    const { user } = this.gateway
    let doc = await user.request({ uri: '/users', type: 'post', data: opts, ips: ips })
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
    const { user, sso } = this.gateway
    let doc = await user.request({ uri: '/signon', type: 'post', data: opts, ips: ips })
    if (doc.err) throw error.err(doc)
    doc = await sso.request({ uri: '/signon', type: 'post', data: doc, ips: ips })
    if (doc.err) throw error.err(doc)
    this.emit('login', { id: doc.id })
    return doc
  }
}
