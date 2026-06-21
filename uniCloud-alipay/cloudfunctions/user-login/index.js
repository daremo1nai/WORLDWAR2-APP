// 用户登录云函数
// URL化路径: /user-login
'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const verify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return hash === verify
}

exports.main = async (event, context) => {
  let username, password

  if (event.body) {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
    username = body.username
    password = body.password
  }
  if (!username) username = event.username
  if (!password) password = event.password

  if (!username || !password) {
    return { code: 400, msg: '账号和密码不能为空' }
  }

  const res = await db.collection('uni-id-users').where({ username }).get()
  if (res.data.length === 0) {
    return { code: 404, msg: '档案号或密令错误' }
  }

  const user = res.data[0]

  if (!verifyPassword(password, user.password)) {
    return { code: 401, msg: '档案号或密令错误' }
  }

  await db.collection('uni-id-users').doc(user._id).update({
    last_login_date: Date.now()
  })

  const token = crypto.randomBytes(32).toString('hex')

  try {
    await db.collection('user_tokens').add({
      user_id: user._id,
      token,
      created_at: Date.now(),
      expires_at: Date.now() + 30 * 24 * 3600 * 1000
    })
  } catch(e) {}

  return {
    code: 0,
    msg: '登录成功',
    data: { uid: user._id, username: user.username, token }
  }
}
