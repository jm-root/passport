/**
 * passport service
 * @param {Object} opts
 * @example
 * opts参数:{
 *  weapp_uri: (可选, 默认'weapp')
 * }
 * @return {Object} service
 */
module.exports = class extends require('service') {
  constructor (opts = {}) {
    super(opts)

    const {
      weapp_uri: weappUri
    } = opts

    setTimeout(() => {
      // 延时确保gateway创建成功
      const { gateway } = this

      gateway.bind('sso')
      gateway.bind('wechatUser', '/wechat-user')
      gateway.bind('weapp', weappUri)

      this.emit('ready')
    }, 1000)
  }

  router (opts) {
    const dir = require('path').join(__dirname, '../router')
    return new (require('router'))(this, { dir, ...opts }).router
  }

  /**
   * 根据微信获取的用户查找对应用户并返回token，如果查不到，先注册用户
   * @param opts
   * @param ips
   * @returns {Promise<*>}
   */
  async signon (opts = {}, ips) {
    const { sso, wechatUser } = this.gateway
    const { openid, unionid, session_key: sessionKey, nickName: nick, gender, country, province, city, avatarUrl } = opts

    let data = {
      openid,
      unionid,
      sessionKey
    }

    nick !== undefined && (data.nick = nick)
    gender !== undefined && (data.gender = gender)
    country !== undefined && (data.country = country)
    province !== undefined && (data.province = province)
    city !== undefined && (data.city = city)
    avatarUrl !== undefined && (data.avatarUrl = avatarUrl)

    const doc = await wechatUser.request({ uri: '/signon/weapp', type: 'post', data, ips })

    const wechat = {
      weapp: {
        openid,
        sessionKey
      }
    }

    data = {
      id: doc.id,
      wechat
    }

    return sso.request({ uri: '/signon', type: 'post', data, ips })
  }

  /**
   * 登陆
   * @param {Object} opts
   * @example
   * opts参数:{
   *  code: 授权code
   *  iv: 加密数据，可选
   *  encryptedData: 加密数据，可选
   * }
   * @returns {Promise<*>}
   */
  async login (opts = {}, ips = []) {
    // 从微信获取用户信息
    const { code, iv, encryptedData } = opts
    const { weapp } = this.gateway
    let doc = await weapp.get(`/auth/${code}`)
    if (iv && encryptedData) {
      const { openid, session_key: sessionKey } = doc
      doc = await weapp.post(`/decrypt`, { sessionKey, iv, encryptedData })
      doc.unionId && (doc.unionid = doc.unionId)
      doc.openid = openid
      doc.session_key = sessionKey
    }

    doc = await this.signon(doc, ips)
    this.emit('login', { id: doc.id })
    return doc
  }

  /**
   * 登陆, 根据openid直接登陆, 有风险, 所以仅限于信任的服务器之间直接调用
   * @param {Object} opts
   * @example
   * opts参数:{
   *  code: 授权code
   * }
   * @returns {Promise<*>}
   */
  async loginByOpenid (opts = {}, ips = []) {
    const doc = await this.signon(opts, ips)
    this.emit('login', { id: doc.id })
    return doc
  }
}
