// 用户注册云函数
// URL化路径: /user-register
'use strict'
const db = uniCloud.database()
const crypto = require('crypto')

// 纯 JS 实现简单的密码哈希（SHA-256 + salt）
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return salt + ':' + hash
}

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
  if (username.length < 2 || username.length > 20) {
    return { code: 400, msg: '账号长度需在2-20位之间' }
  }
  if (password.length < 6 || password.length > 20) {
    return { code: 400, msg: '密码长度需在6-20位之间' }
  }

  const existRes = await db.collection('uni-id-users').where({ username }).get()
  if (existRes.data.length > 0) {
    return { code: 409, msg: '该档案号已存在' }
  }

  const passwordHash = hashPassword(password)
  const now = Date.now()
  const insertRes = await db.collection('uni-id-users').add({
    username,
    password: passwordHash,
    role: ['user'],
    status: 1,
    register_date: now,
    last_login_date: now
  })

  const token = crypto.randomBytes(32).toString('hex')

  return {
    code: 0,
    msg: '注册成功',
    data: { uid: insertRes.id, username, token }
  }
}
