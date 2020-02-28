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
      wechat_uri: wechatUri
    } = opts

    Object.assign(this, { wechatUri })
  }

  router (opts) {
    const dir = `${__dirname}/../router`
    return this.loadRouter(dir, opts)
  }

  get gateway () { return this._gateway }
  set gateway (gateway) {
    this._gateway = gateway
    gateway.bind('sso')
    gateway.bind('wechatUser', '/wechat-user')
    gateway.bind('wechat', this.wechatUri)
    this.emit('ready')
  }

  /**
   * 根据微信获取的用户查找对应用户并返回token，如果查不到，先注册用户
   * @param opts
   * @param ips
   * @returns {Promise<*>}
   */
  async signon (opts = {}, ips) {
    const { sso, wechatUser } = this.gateway
    const { openid, unionid, nick, sex: gender, country, province, city, headimgurl: avatarUrl } = opts

    let data = {
      openid,
      unionid
    }

    nick !== undefined && (data.nick = nick)
    gender !== undefined && (data.gender = gender)
    country !== undefined && (data.country = country)
    province !== undefined && (data.province = province)
    city !== undefined && (data.city = city)
    avatarUrl !== undefined && (data.avatarUrl = avatarUrl)

    const doc = await wechatUser.request({ uri: '/signon/mp', type: 'post', data, ips })

    const wechat = {
      mp: {
        openid,
        avatarUrl
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
   * }
   * @returns {Promise<*>}
   */
  async login ({ code } = {}, ips = []) {
    const { wechat } = this.gateway
    // 从微信获取用户信息
    let doc = await wechat.get(`/oauth/${code}/user`)
    doc = await this.signon(doc, ips)
    this.emit('login', { id: doc.id })
    return doc
  }

  /**
   * 登陆, 根据openid直接登陆, 有风险, 所以仅限于信任的服务器之间直接调用
   * @param {Object} opts
   * @example
   * opts参数:{
   *  openid: openid
   * }
   * @returns {Promise<*>}
   */
  async loginByOpenid ({ openid } = {}, ips = []) {
    const { wechat } = this.gateway
    // 从微信获取用户信息
    let doc = await wechat.get(`/users/${openid}`)
    doc = await this.signon(doc, ips)
    this.emit('login', { id: doc.id })
    return doc
  }
}
