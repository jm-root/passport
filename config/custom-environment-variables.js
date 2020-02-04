module.exports = {
  gateway: 'gateway',
  service_name: 'service_name',

  modules: {
    'passport-wechat': {
      config: {
        wechat_uri: 'wechat_uri'
      }
    },
    'passport-weapp': {
      config: {
        weapp_uri: 'weapp_uri'
      }
    },
    'jm-passport-mobile': {
      config: {
        sms_key_prefix: 'sms_key_prefix',
        sign_name: 'sign_name',
        template_code: 'template_code',
        disable_captcha: 'disable_captcha',
        captcha_key_prefix: 'captcha_key_prefix'
      }
    },
    'jm-server-jaeger': {
      config: {
        jaeger: 'jaeger'
      }
    }
  }
}
