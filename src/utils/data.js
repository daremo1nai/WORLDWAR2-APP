// ============================================
// 统一数据层 — 自动切换 uniCloud / Mock
//
// 策略：
//   - 如果 uni.cloud 可用（APP/小程序/真机）→ 用 uniCloud 云函数
//   - 如果不可用（H5 浏览器开发模式）→ 用 Mock
//
// uniCloud 云函数默认域名：
//   env-00jy6fcmmwui.dev-hz.cloudbasefunction.cn
// ============================================

const CLOUD_BASE_URL = 'https://env-00jy6fcmmwui.dev-hz.cloudbasefunction.cn'

// 通用 HTTP 调用云函数
function callCloud(name, data = {}) {
  return new Promise((resolve) => {
    uni.request({
      url: `${CLOUD_BASE_URL}/${name}`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data,
      success(res) {
        resolve({ data: res.data, error: null })
      },
      fail(err) {
        console.warn(`云函数 ${name} 调用失败，回退 Mock:`, err.errMsg)
        resolve(null)
      }
    })
  })
}

// =========== Auth（优先云函数，回退 Mock）===========
export const auth = {
  async signUp({ email, password }) {
    const username = email.replace('@wwii.internal', '')
    const res = await callCloud('user-register', { username, password })
    if (res && res.data.code === 0) {
      const { uid, token } = res.data.data
      uni.setStorageSync('wwii_token', token)
      uni.setStorageSync('wwii_uid', uid)
      uni.setStorageSync('wwii_username', username)
      uni.setStorageSync('wwii_currentUser', { id: uid, username })
      return { data: { user: { id: uid, email, username } }, error: null }
    }
    if (res) return { data: null, error: { message: res.data.msg } }

    // Mock 回退
    const users = uni.getStorageSync('wwii_users') || []
    if (users.find(u => u.email === email)) {
      return { data: null, error: { message: '该档案号已存在' } }
    }
    const newUser = { id: 'u_' + Date.now(), email, password, createdAt: new Date().toISOString() }
    users.push(newUser)
    uni.setStorageSync('wwii_users', users)
    uni.setStorageSync('wwii_currentUser', { id: newUser.id, username })
    return { data: { user: newUser }, error: null }
  },

  async signInWithPassword({ email, password }) {
    const username = email.replace('@wwii.internal', '')
    const res = await callCloud('user-login', { username, password })
    if (res && res.data.code === 0) {
      const { uid, token } = res.data.data
      uni.setStorageSync('wwii_token', token)
      uni.setStorageSync('wwii_uid', uid)
      uni.setStorageSync('wwii_username', username)
      uni.setStorageSync('wwii_currentUser', { id: uid, username })
      return { data: { user: { id: uid, email, username } }, error: null }
    }
    if (res) return { data: null, error: { message: res.data.msg } }

    // Mock 回退
    const users = uni.getStorageSync('wwii_users') || []
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return { data: null, error: { message: '档案号或密令错误' } }
    uni.setStorageSync('wwii_currentUser', { id: user.id, username: user.email.replace('@wwii.internal', '') })
    return { data: { user }, error: null }
  },

  async getUser() {
    let user = uni.getStorageSync('wwii_currentUser') || null
    if (!user) {
      const username = uni.getStorageSync('wwii_username')
      const uid = uni.getStorageSync('wwii_uid')
      if (username && uid) {
        user = { id: uid, username }
        uni.setStorageSync('wwii_currentUser', user)
      }
    }
    return { data: { user } }
  },

  async signOut() {
    uni.setStorageSync('wwii_token', null)
    uni.setStorageSync('wwii_currentUser', null)
    return { error: null }
  }
}

// =========== DB 操作（优先云函数，回退 Mock）===========

const MOCK_ARTICLES = [
  { id:1, title:'闪电战：从波兰到法国的战术革命', excerpt:'德军如何在不到一年的时间里横扫欧洲大陆？', coverColor:'ac1', type:'article', duration:'35 分钟', wordCount:12800, viewCount:3200, category:'深度解析', emoji:'⚔️', created_at:'2026-05-01',
    content:`一、闪电战的诞生

闪电战（Blitzkrieg）并非纳粹德国的独创，而是普鲁士军事传统与20世纪新技术相结合的产物。其核心理念可以追溯到19世纪毛奇元帅的"分进合击"思想——以快速机动打乱敌军部署，在敌人完成动员之前就将其击溃。

海因茨·古德里安是闪电战理论最重要的实践者。他在1937年出版的《注意，坦克！》一书中系统阐述了装甲兵集中使用的原则：突破一点、纵深穿插、分割包围。这与当时法国固守的"线式防御"思维形成了鲜明对比。

二、波兰战役：闪电战的首次实战检验

1939年9月1日凌晨4时45分，德国不宣而战。斯图卡俯冲轰炸机的尖啸声成为这场战争最令人恐惧的音符。德军投入5个集团军，共150万人、2500辆坦克、2000架飞机，以南北两个集团军群对波兰实施钳形攻势。

波兰军队的抵抗在理论上是英勇的——他们拥有100万军队，但装备落后，将骑兵作为机动力量使用。面对德军的装甲集群，波兰骑兵冲击坦克的悲壮场面成为二战最具象征性的画面之一。仅仅27天，华沙沦陷，波兰再次从欧洲地图上消失。

三、黄色方案：绕过马奇诺防线

法国在战后投入巨资修建的马奇诺防线，体现了一战思维的惯性——相信坚固工事可以阻止任何进攻。但德军B集团军群在1940年5月10日入侵比利时和荷兰，将英法联军主力吸引北上。与此同时，A集团军群的7个装甲师穿越被认为"坦克无法通过"的阿登森林，直插英吉利海峡。

5月13日，古德里安的第19装甲军在色当强渡默兹河。法国守军崩溃，德军坦克以每天50-70公里的速度向西推进。5月20日，先头部队抵达英吉利海峡，完成了对英法联军主力的合围。法国这个号称"欧陆第一陆军强国"的国家，在六周内宣告投降。

四、闪电战的战术精髓

闪电战的本质不是"快"，而是"穿透"——在狭窄正面集中压倒性火力打开缺口后，装甲部队不惜代价向纵深猛插，不管侧翼暴露。后续步兵负责肃清残敌、巩固走廊。这种战法要求在"战役层面"而非"战术层面"上思考问题：目标不是消灭敌人，而是瘫痪其指挥系统和作战意志。

五、遗产与反思

闪电战的成功有其时代局限性。它依赖于对手的"瘫痪反应"——当波兰和法国面对超出其条令框架的作战方式时，完全丧失了应变能力。但在苏联的广袤土地上，当面对同样意志顽强的对手时，闪电战的效力大打折扣。巴巴罗萨行动初期德军的辉煌战绩最终在莫斯科城下戛然而止，证明了闪电战的另一面：当敌人不投降、不退却时，深入敌后的装甲矛头也面临着被切断的致命风险。`
  },
  { id:2, title:'艾森豪威尔：盟军最高统帅的领导艺术', excerpt:'一个从未指挥过战斗的上校，如何在三年内成为最高统帅？', coverColor:'ac2', type:'article', duration:'25 分钟', wordCount:9500, viewCount:2100, category:'人物评传', emoji:'🏛️', created_at:'2026-05-05',
    content:`一、不可能的任务

1942年6月，德怀特·戴维·艾森豪威尔还只是美国陆军作战计划处的一名准将。仅仅两年后，他已经成为人类历史上最大规模两栖登陆作战的最高指挥官。更令人惊讶的是，这位最高统帅从未在战场上指挥过一个排——他的军事生涯几乎全部在参谋岗位上度过。

正是这种参谋背景，而非战场功勋，塑造了艾森豪威尔独一无二的领导风格。他理解后勤、懂得协调、善于在不同利益之间寻找平衡点——这些能力在指挥一支由十多个国家军队组成、军官之间相互看不顺眼的联军时，比单纯的战术天赋更加珍贵。

二、联盟的艺术

艾森豪威尔面临的最大挑战不是德国人，而是他自己人。蒙哥马利自恃北非战功，对美军的战术素养嗤之以鼻；巴顿脾气火爆，在媒体面前屡次闯祸；戴高乐将法国的主权尊严看得比军事胜利更重……艾森豪威尔必须在这些强势人物之间周旋，同时保持盟军的团结和作战效率。

他最著名的"外交胜利"发生在1944年初。当时蒙哥马利极力主张将诺曼底登陆规模缩小，集中力量在单一方向突破。艾森豪威尔坚持了"宽大正面"战略——五路并进的登陆方案。事后证明，这一决策最大限度地发挥了盟军的物质优势，避免了在狭窄正面被德军反扑的风险。

三、D日的抉择

1944年6月4日，诺曼底登陆的前夜，艾森豪威尔面临他一生中最艰难的决定。英吉利海峡风高浪急，气象预报显示6月6日可能有一个短暂的窗口期。如果推迟，下一个适合登陆的潮汐周期要等到两周之后——而德军正在加强大西洋壁垒的防御。

"好，我们出发。"这是他下达的最后命令。他还准备了一份声明——如果登陆失败，所有责任由他一人承担。这份手写的坦白书至今仍保存在美国国家档案馆，上面的折痕证明他曾反复斟酌。它代表了一种罕见的领导品格：在关键时刻敢于决策，同时敢于为失败负责。

四、宽大正面与集中突破之争

1944年秋季，随着盟军从诺曼底突破后快速推进，补给线被拉到了极限。蒙哥马利再次提出了"一路突击"方案——集中所有资源，由他指挥穿过荷兰直插鲁尔区。这就是"市场花园行动"，最终以失败告终。

艾森豪威尔随后恢复了"宽大正面"战略，让美军、英军、法军分路推进。这是一个政治上更安全、军事上更稳健的选择——它放弃了速胜的幻想，换来了稳操胜券的推进节奏。批评者认为这"延长了战争"，但支持者指出，这正是作为联军统帅所需的政治智慧：他不只是在打一场仗，而是在管理一场战争。

五、评价

艾森豪威尔在二战中的成就，不在于他的战术天才，而在于他打造了一个能够自我运转的指挥体系。当他的下属——布雷德利、巴顿、蒙哥马利——在战场上各显神通时，他确保了他们的努力指向同一个方向。这是一种看不见的军事才能：不是指挥军队的能力，而是指挥指挥官的能力。`
  },
  { id:3, title:'太平洋战争转折点：中途岛海战全复盘', excerpt:'五分钟的差距决定国运。', coverColor:'ac3', type:'article', duration:'42 分钟', wordCount:15200, viewCount:5600, category:'战史复盘', emoji:'🌊', created_at:'2026-05-10',
    content:`一、战略背景：为什么是中途岛？

1942年春季，日本联合舰队在太平洋上似乎不可战胜。从珍珠港到新加坡，从菲律宾到荷属东印度，大日本帝国的版图在六个月内扩张到了极限。然而，山本五十六心中清楚：时间站在美国人一边。美国的工业机器一旦全速运转，日本将毫无胜算。

因此，山本制定了一个大胆的计划：攻占中途岛，引诱美国太平洋舰队残余的航母前来决战，一举歼灭。如果成功，日本将获得一个可以威胁夏威夷的前沿基地，迫使美国回到谈判桌前。这是典型的"决战思维"——渴望在一次决定性的战役中彻底摧毁对手。

但山本不知道的是，美国人已经能够读懂他的"邮件"。

二、情报：密码战的胜利

美国海军作战情报局（OP-20-G）下属的HYPO站（位于珍珠港），在约瑟夫·罗彻福特中校的领导下，成功破译了日本海军JN-25密码的部分内容。通过一个巧妙的测试——用明码电报报告中途岛淡水设备故障，然后截获日军密电"AF缺乏淡水"——罗彻福特确认了日军的目标就是中途岛。

到1942年5月底，太平洋舰队司令尼米兹已经掌握了日军的大致进攻时间、方向和兵力组成。这是军事史上情报优势转化为战役胜利的经典案例。尼米兹敢于将仅有的三艘航母（"企业号"、"大黄蜂号"、"约克城号"）全部投入中途岛，正是因为他知道自己不会面对奇袭。

三、"决定命运的五分钟"

1942年6月4日凌晨4时30分，南云忠一中将指挥的机动部队开始对中途岛发动空袭。第一波108架飞机虽然重创了岛上的防御设施，但未能摧毁跑道。南云下令原本挂载鱼雷准备攻击美军舰艇的第二波飞机换挂炸弹，再次攻击中途岛。

7时28分，一架日军侦察机报告发现美军舰队。南云再次改变命令——让已经换挂炸弹的飞机重新换挂鱼雷。甲板上摆满了卸下的炸弹，机库内一片混乱。就在7时45分至8时之间，南云做出了最致命的决定：优先回收第一波返航飞机，等全部战机加满油、挂好弹后再发动总攻。

10时20分，当日军航母甲板上挤满了正在加油挂弹的飞机时，美军俯冲轰炸机出现在云层上方。

"企业号"的VB-6和VS-6中队、"约克城号"的VB-3中队几乎同时发起了攻击。从发现目标到炸弹落下，整个过程不超过五分钟。"赤城号"被两枚1000磅炸弹命中，引爆了甲板上的燃料和弹药；"加贺号"被四枚炸弹击中；"苍龙号"被三枚炸弹命中。三艘主力航母在六小时内全部沉没。下午，"飞龙号"也被美军发现并击沉。

四、后果：太平洋战争的转折点

日本联合舰队损失了四艘主力航母、248架舰载机和大量经验丰富的飞行员——这些飞行员的损失比航母的损失更为致命。日本工业能力无法在短时间内补充如此大规模的训练有素的航空兵。从此，日本在太平洋上丧失了战略主动权。

中途岛海战证明，决定海战胜负的不再是巨舰大炮，而是航空母舰和舰载机。这场战役也标志着"大舰巨炮主义"的终结——进入现代海战时代。

五、历史的"如果"

南云忠一在中途岛的决策至今仍是军事学界讨论的热点。如果他派出足够的侦察机，如果他不等第一波飞机回收就发动攻击，如果他没有改变炸弹挂载命令……"反事实推演"的魅力正在于此。但军事史学家普遍认为，在情报已被破译的前提下，日军的失败具有一定程度的必然性——美国海军的战术选择和时机把握，建立在信息不对称的优势之上。这是密码战的胜利，也是一场属于情报人员的战役。`
  },
  { id:4, title:'二战全史：从凡尔赛到冷战', excerpt:'系统梳理二战全过程', coverColor:'vt1', type:'video', duration:'共24集', rating:'4.9', plays:'12.8万', created_at:'2026-04-20',
    description:'这是一部全景式梳理二战历史的纪录片系列。从1919年《凡尔赛和约》埋下的种子，到1939年德国入侵波兰引爆全球战火，从太平洋到欧洲战场，从诺曼底登陆到广岛原子弹，24集内容覆盖了二战所有关键战役和外交博弈。由英国历史学家安东尼·比弗担任顾问解说，大量使用珍贵的战时档案影像资料。',
    videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id:5, title:'诺曼底登陆：D-Day 全纪实', excerpt:'90分钟纪录片', coverColor:'vt2', type:'video', duration:'90分钟', rating:'4.8', plays:'8.3万', created_at:'2026-04-25',
    description:'1944年6月6日，代号"霸王行动"的诺曼底登陆是人类历史上最大规模的两栖登陆作战。本片从盟军的战略筹划、德军的防御准备、登陆当天的惨烈战斗到向内陆推进的关键时刻，全面还原这个改变世界命运的日子。收录了大量珍贵的D-Day现场影像和对参战老兵的深度采访。',
    videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
  { id:6, title:'武器解码：二战坦克进化史', excerpt:'科普系列共8集', coverColor:'vt3', type:'video', duration:'共8集', rating:'4.7', plays:'6.5万', created_at:'2026-05-02',
    description:'从二战初期的轻型坦克到战争末期的重型钢铁巨兽，本系列深度解析二战中各国坦克的技术演进与实战表现。涵盖德国虎式、豹式、苏联T-34、美国谢尔曼、英国丘吉尔等经典型号的设计理念、战场表现和技术遗产。每集聚焦一种代表性坦克，通过3D建模还原内部结构和作战场景。',
    videoUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
]

const MOCK_QUESTIONS = [
  { id:1, question:'第二次世界大战欧洲战场爆发的标志性事件是？', options:['A. 德国入侵波兰','B. 珍珠港事件','C. 诺曼底登陆','D. 斯大林格勒战役'], answer:0, difficulty:'easy', category:'欧洲战场', explanation:'1939年9月1日德国入侵波兰，英法随即对德宣战。' },
  { id:2, question:'中途岛海战发生于哪一年？', options:['A. 1941年','B. 1942年','C. 1943年','D. 1944年'], answer:1, difficulty:'medium', category:'太平洋战场', explanation:'中途岛海战发生于1942年6月，美军击沉日本四艘主力航母。' },
  { id:3, question:'"霸王行动"是哪场战役的代号？', options:['A. 巴巴罗萨行动','B. 市场花园行动','C. 诺曼底登陆','D. 火炬行动'], answer:2, difficulty:'hard', category:'战略分析', explanation:'霸王行动是1944年6月6日诺曼底登陆的代号。' },
  { id:4, question:'斯大林格勒战役持续了大约多长时间？', options:['A. 3个月','B. 5个月','C. 7个月','D. 9个月'], answer:1, difficulty:'medium', category:'东线战场', explanation:'从1942年8月持续到1943年2月，约5个月。' },
  { id:5, question:'日本偷袭珍珠港的日期是？', options:['A. 1941年12月7日','B. 1941年11月7日','C. 1942年1月7日','D. 1940年12月7日'], answer:0, difficulty:'easy', category:'太平洋战场', explanation:'1941年12月7日，日本偷袭珍珠港。' }
]

const MOCK_POSTS = [
  { id:1, title:'【深度】阿拉曼战役中装甲兵运用的战术得失', content:'从后勤补给线、地形利用和装甲兵协同三个维度，重新审视这场北非战场的转折点。', author:'隆美尔之狐', category:'名将评析', like_count:247, comment_count:83, view_count:1200, tags:['#北非战场#'], created_at:'2026-06-04T10:00:00Z', avatar:'🎖️', av:'av1' },
  { id:2, title:'假如南云忠一在中途岛做出了不同的决策？', content:'如果日军保留了机动部队主力，太平洋战局是否会被改写？', author:'太平洋观察者', category:'太平洋战争', like_count:412, comment_count:156, view_count:2800, tags:['#反事实推演#'], created_at:'2026-06-04T08:00:00Z', avatar:'📡', av:'av2' },
  { id:3, title:'【资料整理】二战各主要参战国战时工业产能对比', content:'整理了美苏德英日五国数据。', author:'战史研究生', category:'资源分享', like_count:189, comment_count:42, view_count:956, tags:['#数据#'], created_at:'2026-06-03T16:00:00Z', avatar:'📚', av:'av3' },
  { id:4, title:'【高清地图】1944年诺曼底登陆作战全貌图', content:'从英国国家档案馆获取的高分辨率扫描件。', author:'地图收藏家', category:'资源分享', like_count:531, comment_count:98, view_count:4100, tags:['#地图#'], created_at:'2026-06-02T12:00:00Z', avatar:'🗺️', av:'av1' }
]

export const db = {
  async getArticleById(id) {
    const articles = await this.getArticles()
    return articles.find(a => a.id == id) || null
  },

  async getArticles(type = null) {
    const res = await callCloud('get-articles', type ? { type } : {})
    if (res && res.data.code === 0) {
      // 合并云函数返回的数据和本地 Mock — 云函数可能没有 content/description
      const data = res.data.data.map(d => {
        const mock = MOCK_ARTICLES.find(m => m.id == d.id)
        return {
          ...d,
          emoji: d.emoji || (mock ? mock.emoji : '📖'),
          content: d.content || (mock ? mock.content : ''),
          description: d.description || (mock ? mock.description : ''),
          videoUrl: d.videoUrl || (mock ? mock.videoUrl : '')
        }
      })
      return data
    }
    return type ? MOCK_ARTICLES.filter(d => d.type === type) : MOCK_ARTICLES
  },

  async getQuiz() {
    const res = await callCloud('get-quiz', { limit: 10 })
    if (res && res.data.code === 0) return res.data.data.map(q => ({ ...q, selected: undefined }))
    return MOCK_QUESTIONS.map(q => ({ ...q, selected: undefined }))
  },

  async getPostById(id) {
    const res = await callCloud('get-posts', { limit: 100 })
    if (res && res.data.code === 0) {
      const post = res.data.data.find(p => p._id === id || p.id == id)
      if (post) return post
    }
    // Mock 回退
    const saved = uni.getStorageSync('wwii_posts') || []
    const all = [...saved, ...MOCK_POSTS]
    return all.find(p => p.id == id) || null
  },

  async getPosts() {
    const saved = uni.getStorageSync('wwii_posts') || []
    const res = await callCloud('get-posts', { limit: 20 })
    if (res && res.data.code === 0) {
      return res.data.data.map(p => ({
        ...p,
        author: p.author || '未知用户',
        avatar: p.avatar || '📝',
        av: 'av' + ((p.id % 3) + 1),
        likes: p.like_count || 0,
        comments: p.comment_count || 0,
        views: (p.view_count || 0) >= 1000 ? ((p.view_count/1000).toFixed(1)+'k') : (p.view_count || 0),
        excerpt: (p.content || '').slice(0, 100) + '...'
      }))
    }
    return [...saved, ...MOCK_POSTS].map(p => ({
      ...p,
      likes: p.like_count || 0,
      comments: p.comment_count || 0,
      views: (p.view_count || 0) >= 1000 ? ((p.view_count/1000).toFixed(1)+'k') : (p.view_count || 0),
      excerpt: (p.content || '').slice(0, 100) + '...'
    }))
  },

  async createPost({ title, content, category }) {
    const token = uni.getStorageSync('wwii_token') || ''
    const res = await callCloud('create-post', { title, content, category, token })
    if (res && res.data.code === 0) return res.data.data

    // Mock 回退
    const posts = uni.getStorageSync('wwii_posts') || []
    const newPost = {
      id: Date.now(),
      title, content,
      author: '匿名用户',
      category: category || '其他',
      like_count: 0, comment_count: 0, view_count: 0,
      created_at: new Date().toISOString(),
      avatar: '📝', av: 'av' + ((posts.length%3)+1)
    }
    posts.unshift(newPost)
    uni.setStorageSync('wwii_posts', posts)
    return newPost
  },

  async submitQuiz(answers) {
    const token = uni.getStorageSync('wwii_token') || ''
    const res = await callCloud('submit-quiz', { token, answers })
    if (res && res.data.code === 0) return res.data.data
    // Mock 回退：用本地答案
    let correct = 0
    answers.forEach(a => { if (MOCK_QUESTIONS.find(q => q.id === a.questionId && q.answer === a.userAnswer)) correct++ })
    return { total: answers.length, correct, score: Math.round((correct/answers.length)*100) }
  }
}
