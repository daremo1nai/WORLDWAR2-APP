// 获取测验题目云函数
// URL化路径: /get-quiz
'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  let body = event.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch(e) {}
  }
  const { limit = 5 } = body || event

  const res = await db.collection('quiz_questions')
    .limit(limit)
    .get()

  // 如果数据库为空，返回预设题目
  if (res.data.length === 0) {
    return {
      code: 0,
      data: [
        { id:1, question:'第二次世界大战欧洲战场爆发的标志性事件是？', options:['A. 德国入侵波兰','B. 珍珠港事件','C. 诺曼底登陆','D. 斯大林格勒战役'], answer:0, difficulty:'easy', category:'欧洲战场', explanation:'1939年9月1日德国入侵波兰，英法随即对德宣战，标志着二战的全面爆发。' },
        { id:2, question:'中途岛海战发生于哪一年？', options:['A. 1941年','B. 1942年','C. 1943年','D. 1944年'], answer:1, difficulty:'medium', category:'太平洋战场', explanation:'中途岛海战发生于1942年6月，美军击沉日本四艘主力航母。' },
        { id:3, question:'"霸王行动"是哪场战役的代号？', options:['A. 巴巴罗萨行动','B. 市场花园行动','C. 诺曼底登陆','D. 火炬行动'], answer:2, difficulty:'hard', category:'战略分析', explanation:'霸王行动是1944年6月6日诺曼底登陆的代号。' },
        { id:4, question:'斯大林格勒战役持续了大约多长时间？', options:['A. 3个月','B. 5个月','C. 7个月','D. 9个月'], answer:1, difficulty:'medium', category:'东线战场', explanation:'从1942年8月持续到1943年2月，约5个月。' },
        { id:5, question:'日本偷袭珍珠港的日期是？', options:['A. 1941年12月7日','B. 1941年11月7日','C. 1942年1月7日','D. 1940年12月7日'], answer:0, difficulty:'easy', category:'太平洋战场', explanation:'1941年12月7日，日本偷袭珍珠港，美国正式参战。' }
      ]
    }
  }

  // 去掉正确答案返回给前端（防止作弊）
  const questions = res.data.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    difficulty: q.difficulty,
    category: q.category
  }))

  return { code: 0, data: questions }
}
