const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

test('login', async () => {
  let doc = await router.post('/login', { code: '043PJNbz0OVTxb1QcS8z0d94cz0PJNbb' }, { headers: { trace: true } })
  console.log(doc)
})
