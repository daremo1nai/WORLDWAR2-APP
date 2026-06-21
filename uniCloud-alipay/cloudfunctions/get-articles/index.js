// 获取课堂文章/视频云函数
// URL化路径: /get-articles
'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  // 兼容 URL 触发：参数可能在 event.body 里
  let params = event
  if (event.body && typeof event.body === 'string') {
    try { params = JSON.parse(event.body) } catch(e) {}
  } else if (event.body && typeof event.body === 'object') {
    params = event.body
  }
  const { type } = params  // 可选: 'article' | 'video' | 不传则全部

  let query = db.collection('articles')

  if (type) {
    query = query.where({ type })
  }

  const res = await query.orderBy('created_at', 'desc').get()

  // 如果数据库为空，返回预设数据
  if (res.data.length === 0) {
    return {
      code: 0,
      data: [
        { id:1, title:'闪电战：从波兰到法国的战术革命', excerpt:'德军如何在不到一年的时间里横扫欧洲大陆？', coverColor:'ac1', type:'article', duration:'35 分钟', wordCount:12800, viewCount:3200, category:'深度解析', emoji:'⚔️', content:'详见客户端 Mock 数据' },
        { id:2, title:'艾森豪威尔：盟军最高统帅的领导艺术', excerpt:'一个从未指挥过战斗的上校，如何在三年内成为最高统帅？', coverColor:'ac2', type:'article', duration:'25 分钟', wordCount:9500, viewCount:2100, category:'人物评传', emoji:'🏛️', content:'详见客户端 Mock 数据' },
        { id:3, title:'太平洋战争转折点：中途岛海战全复盘', excerpt:'五分钟的差距决定国运。', coverColor:'ac3', type:'article', duration:'42 分钟', wordCount:15200, viewCount:5600, category:'战史复盘', emoji:'🌊', content:'详见客户端 Mock 数据' },
        { id:4, title:'二战全史：从凡尔赛到冷战', excerpt:'系统梳理二战全过程', coverColor:'vt1', type:'video', duration:'共24集', rating:'4.9', plays:'12.8万', description:'全景式梳理二战历史的纪录片系列，共24集。', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { id:5, title:'诺曼底登陆：D-Day 全纪实', excerpt:'90分钟纪录片', coverColor:'vt2', type:'video', duration:'90分钟', rating:'4.8', plays:'8.3万', description:'人类历史上最大规模两栖登陆作战的全纪实纪录片。', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
        { id:6, title:'武器解码：二战坦克进化史', excerpt:'科普系列共8集', coverColor:'vt3', type:'video', duration:'共8集', rating:'4.7', plays:'6.5万', description:'深度解析二战中各国坦克的技术演进与实战表现，共8集。', videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
      ]
    }
  }

  return { code: 0, data: res.data }
}
