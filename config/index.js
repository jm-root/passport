require('log4js').configure(require('./log4js'))
process.env.NODE_CONFIG_DIR = require('path').join(__dirname)
const config = require('config')

const { modules } = config
modules['jm-passport-mobile'] && (modules['jm-passport-mobile'].prefix = '/passport/mobile')
modules['jm-passport'] = { module: 'jm-passport', prefix: '/passport' } // 最后加载 jm-passport

module.exports = config
