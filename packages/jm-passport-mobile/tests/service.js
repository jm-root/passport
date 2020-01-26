const config = require('../../../config')
const $ = require('../lib')

const opts = { ...config, ...config.modules['jm-passport-mobile'].config }
console.log(opts)

const service = $(opts)

module.exports = service
