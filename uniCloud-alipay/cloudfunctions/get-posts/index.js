// 获取帖子列表云函数
// URL化路径: /get-posts
'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  let body = event.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch(e) {}
  }
  const { limit = 20 } = body || event

  const res = await db.collection('posts')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .get()

  // 如果数据库为空，返回预设示例数据
  if (res.data.length === 0) {
    return {
      code: 0,
      data: [
        { id:1, title:'【深度】阿拉曼战役中装甲兵运用的战术得失', content:'从后勤补给线、地形利用和装甲兵协同三个维度，重新审视这场北非战场的转折点。', author:'隆美尔之狐', category:'名将评析', like_count:247, comment_count:83, view_count:1200, created_at:'2026-06-04', avatar:'🎖️' },
        { id:2, title:'假如南云忠一在中途岛做出了不同的决策？', content:'如果日军保留了机动部队主力，太平洋战局是否会被改写？', author:'太平洋观察者', category:'太平洋战争', like_count:412, comment_count:156, view_count:2800, created_at:'2026-06-04', avatar:'📡' },
        { id:3, title:'【资料整理】二战各主要参战国战时工业产能对比', content:'整理了美苏德英日五国的钢产量、石油产量和飞机产量数据。', author:'战史研究生', category:'资源分享', like_count:189, comment_count:42, view_count:956, created_at:'2026-06-03', avatar:'📚' },
        { id:4, title:'【高清地图】1944年诺曼底登陆作战全貌图', content:'从英国国家档案馆获取的高分辨率扫描件。', author:'地图收藏家', category:'资源分享', like_count:531, comment_count:98, view_count:4100, created_at:'2026-06-02', avatar:'🗺️' }
      ]
    }
  }

  return { code: 0, data: res.data }
}
