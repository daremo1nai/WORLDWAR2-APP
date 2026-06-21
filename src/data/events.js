// ============================================
// 二战态势图 - 历史事件数据
// 每条事件含坐标，Leaflet 地图自动打点
// ============================================

export default [
  { id:1,  title:"德国入侵波兰",       year:1939.66, dateStr:"1939年9月1日",   lat:52.06, lng:19.25,  type:"axis",   desc:"二战欧洲战场爆发的标志。德军闪电战迅速击溃波兰防线。" },
  { id:2,  title:"冬季战争",           year:1939.91, dateStr:"1939年11月30日", lat:60.17, lng:24.94,  type:"neutral",desc:"苏联入侵芬兰，芬兰以弱胜强。" },
  { id:3,  title:"大西洋海战",         year:1939.91, dateStr:"1939年9月-1945年", lat:50.0, lng:-20.0,  type:"neutral",desc:"二战持续时间最长的战役，德国U艇对盟军护航船队的绞杀战。" },
  { id:4,  title:"威瑟堡行动",         year:1940.25, dateStr:"1940年4月9日",   lat:55.68, lng:12.57,  type:"axis",   desc:"德国入侵丹麦和挪威，确保北欧铁矿砂供应线。" },
  { id:5,  title:"纳尔维克战役",       year:1940.33, dateStr:"1940年4月-6月",  lat:68.43, lng:17.43,  type:"allied", desc:"盟军在挪威纳尔维克的反击，虽战术胜利但最终因法国战局恶化而撤离。" },
  { id:6,  title:"法国战役",           year:1940.41, dateStr:"1940年5月10日",  lat:49.50, lng:2.50,   type:"axis",   desc:"德军绕过马奇诺防线闪击西欧，六周内法国投降。" },
  { id:7,  title:"敦刻尔克大撤退",     year:1940.50, dateStr:"1940年5月26日",  lat:51.03, lng:2.38,   type:"neutral",desc:"发电机行动——33万英法联军从敦刻尔克海滩成功撤退至英国。" },
  { id:8,  title:"不列颠空战",         year:1940.66, dateStr:"1940年7月-10月", lat:51.50, lng:-0.12,  type:"allied", desc:"皇家空军英勇抵抗，希特勒首尝败绩，推迟海狮计划。" },
  { id:9,  title:"克里特岛战役",       year:1941.41, dateStr:"1941年5月20日",  lat:35.24, lng:24.81,  type:"axis",   desc:"德军首次大规模空降作战，以惨重代价夺取克里特岛。" },
  { id:10, title:"巴巴罗萨行动",       year:1941.50, dateStr:"1941年6月22日",  lat:55.75, lng:37.62,  type:"axis",   desc:"纳粹德国撕毁条约入侵苏联，史上最大规模陆上攻势。" },
  { id:11, title:"列宁格勒围城",       year:1941.66, dateStr:"1941年9月8日",   lat:59.93, lng:30.34,  type:"neutral",desc:"872天的围城，超过100万平民死亡，列宁格勒永不屈服。" },
  { id:12, title:"莫斯科战役",         year:1941.83, dateStr:"1941年10月-1942年1月", lat:55.75, lng:37.62, type:"allied", desc:"德军闪电战首次被挫败，苏联红军在严寒中发起反击。" },
  { id:13, title:"珍珠港事件",         year:1941.91, dateStr:"1941年12月7日",  lat:21.36, lng:-157.95, type:"axis",   desc:"日本偷袭珍珠港，重创美国太平洋舰队，美国正式参战。" },
  { id:14, title:"珊瑚海海战",         year:1942.37, dateStr:"1942年5月4-8日",  lat:-15.0, lng:155.0,  type:"allied", desc:"史上首次航母对决，日军南下进攻莫尔兹比港被阻止。" },
  { id:15, title:"中途岛海战",         year:1942.45, dateStr:"1942年6月4日",   lat:28.20, lng:-177.35, type:"allied", desc:"太平洋战场转折点，美军击沉日本四艘主力航母。" },
  { id:16, title:"斯大林格勒战役",     year:1942.58, dateStr:"1942年8月-1943年2月", lat:48.70, lng:44.51, type:"allied", desc:"二战最惨烈战役之一，东线转折点，德军第六集团军覆灭。" },
  { id:17, title:"瓜达尔卡纳尔战役",   year:1942.66, dateStr:"1942年8月-1943年2月", lat:-9.58, lng:160.15, type:"allied", desc:"美军在南太平洋首次大规模反攻，争夺亨德森机场的血战。" },
  { id:18, title:"阿拉曼战役",         year:1942.83, dateStr:"1942年10月23日", lat:30.83, lng:28.95,  type:"allied", desc:"蒙哥马利率英第八集团军在北非击败隆美尔的非洲军团。" },
  { id:19, title:"火炬行动",           year:1942.91, dateStr:"1942年11月8日",  lat:35.60, lng:-2.50,  type:"allied", desc:"英美联军登陆北非法属摩洛哥和阿尔及利亚，夹击隆美尔。" },
  { id:20, title:"库尔斯克会战",       year:1943.55, dateStr:"1943年7月5日",   lat:51.72, lng:36.19,  type:"allied", desc:"史上最大规模坦克会战，普罗霍罗夫卡的钢铁碰撞。" },
  { id:21, title:"西西里登陆",         year:1943.58, dateStr:"1943年7月9日",   lat:37.60, lng:14.02,  type:"allied", desc:"哈士奇行动——盟军登陆西西里岛，敲开欧洲南大门。" },
  { id:22, title:"意大利投降",         year:1943.66, dateStr:"1943年9月8日",   lat:41.90, lng:12.50,  type:"allied", desc:"意大利与盟军签署停战协议，轴心国开始瓦解。" },
  { id:23, title:"卡西诺山战役",       year:1944.16, dateStr:"1944年1月-5月",  lat:41.49, lng:13.81,  type:"allied", desc:"盟军沿古斯塔夫防线血战四个月，本笃会修道院化为废墟。" },
  { id:24, title:"诺曼底登陆",         year:1944.45, dateStr:"1944年6月6日",   lat:49.33, lng:-0.88,  type:"allied", desc:"霸王行动——人类历史上最大规模两栖登陆作战，开辟第二战场。" },
  { id:25, title:"巴黎解放",           year:1944.58, dateStr:"1944年8月25日",  lat:48.86, lng:2.35,   type:"allied", desc:"自由法国第二装甲师进入巴黎，三色旗重新在凯旋门升起。" },
  { id:26, title:"华沙起义",           year:1944.66, dateStr:"1944年8月-10月", lat:52.23, lng:21.01,  type:"neutral",desc:"波兰国家军英勇起义，苦战63天后弹尽粮绝，华沙被夷为平地。" },
  { id:27, title:"市场花园行动",       year:1944.74, dateStr:"1944年9月17日",  lat:51.98, lng:5.91,   type:"allied", desc:"蒙哥马利大胆的空降作战计划，最终'遥远的桥'未能跨越莱茵河。" },
  { id:28, title:"莱特湾海战",         year:1944.82, dateStr:"1944年10月23-26日", lat:10.83,lng:125.42, type:"allied", desc:"史上最大规模海战，日本联合舰队主力覆灭，神风特攻队首次登场。" },
  { id:29, title:"突出部战役",         year:1944.91, dateStr:"1944年12月16日", lat:50.25, lng:5.50,   type:"allied", desc:"突出部之役——德军西线最后的大规模反攻，巴斯托涅的101空降师坚守不退。" },
  { id:30, title:"硫磺岛战役",         year:1945.16, dateStr:"1945年2月19日",  lat:24.78, lng:141.32, type:"allied", desc:"美军伤亡惨重的岛屿攻坚战，星条旗在折钵山顶升起。" },
  { id:31, title:"雅尔塔会议",         year:1945.16, dateStr:"1945年2月4-11日", lat:44.50, lng:34.17,  type:"allied", desc:"罗斯福、丘吉尔、斯大林三巨头敲定战后世界格局。" },
  { id:32, title:"冲绳战役",           year:1945.33, dateStr:"1945年4月-6月",  lat:26.33, lng:127.80, type:"allied", desc:"太平洋战场最后一场大规模战役，日军疯狂抵抗，平民伤亡惨重。" },
  { id:33, title:"柏林战役",           year:1945.33, dateStr:"1945年4月16日",  lat:52.52, lng:13.40,  type:"allied", desc:"苏军集结250万兵力攻入柏林，红旗插上国会大厦。" },
  { id:34, title:"德国无条件投降",     year:1945.37, dateStr:"1945年5月8日",   lat:52.52, lng:13.38,  type:"allied", desc:"欧战胜利日——纳粹德国无条件投降，V-E Day。" },
  { id:35, title:"广岛与长崎原子弹",   year:1945.60, dateStr:"1945年8月6日/9日", lat:34.39,lng:132.46, type:"allied", desc:"原子弹加速了战争结束，也拉开了核时代的序幕。" },
  { id:36, title:"日本无条件投降",     year:1945.66, dateStr:"1945年9月2日",   lat:35.68, lng:139.76, type:"allied", desc:"密苏里号战列舰上签署投降书，二战正式结束，V-J Day。" }
]
