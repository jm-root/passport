module.exports = {
  appenders: {
    console: { type: 'console' },
    passport: {
      type: 'dateFile',
      filename: 'logs/passport',
      pattern: 'yyyyMMdd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: [ 'console' ], level: 'info' },
    passport: { appenders: [ 'console', 'passport' ], level: 'info' }
  }
}
