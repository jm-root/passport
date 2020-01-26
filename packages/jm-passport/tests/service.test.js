const $ = require('./service')

let service = $

let account = 'test' + Date.now()
test('register', async () => {
  let doc = await service.register({
    account: account,
    password: '123'
  })
  expect(doc.id).toBeTruthy()
})

test('login', async () => {
  let doc = await service.login({
    username: account,
    password: '123'
  })
  expect(doc.token).toBeTruthy()
})
