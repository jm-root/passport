const $ = require('./service')
let router = $.router()

let account = 'test' + Date.now()
test('register', async () => {
  let doc = await router.post('/register', { account: account, password: '123' })
  expect(doc.id).toBeTruthy()
})

test('login', async () => {
  let doc = await router.post('/login', { username: account, password: '123' })
  expect(doc.token).toBeTruthy()
})
