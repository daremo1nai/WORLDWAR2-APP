// 创建帖子云函数
// URL化路径: /create-post
'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  let body = event.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch(e) {}
  }
  const { title, content, category, token } = body || event

  if (!title || !content) {
    return { code: 400, msg: '标题和内容不能为空' }
  }

  // 校验 token（通过 user_tokens 表查）
  let user_id = null
  let username = '匿名用户'

  if (token) {
    try {
      const tokenRes = await db.collection('user_tokens').where({ token }).get()
      if (tokenRes.data.length > 0) {
        user_id = tokenRes.data[0].user_id
        const userRes = await db.collection('uni-id-users').doc(user_id).get()
        if (userRes.data.length > 0) {
          username = userRes.data[0].username
        }
      }
    } catch(e) {}
  }

  const now = new Date().toISOString()
  const insertRes = await db.collection('posts').add({
    title,
    content,
    author: username,
    author_id: user_id,
    category: category || '其他',
    like_count: 0,
    comment_count: 0,
    view_count: 0,
    is_pinned: false,
    created_at: now
  })

  return {
    code: 0,
    msg: '发帖成功',
    data: {
      id: insertRes.id,
      title,
      content: content.slice(0, 100) + '...',
      author: username,
      category: category || '其他',
      like_count: 0,
      comment_count: 0,
      view_count: 0,
      created_at: now
    }
  }
}
