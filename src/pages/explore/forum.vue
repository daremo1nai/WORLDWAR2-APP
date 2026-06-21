<template>
<view class="page">
  <view class="page-header">
    <text class="overline">WAR COLLEGE · DISCUSSION</text>
    <text class="title">战史研讨</text>
    <text class="subtitle">以史为鉴，可以知兴替</text>
    <view class="divider"></view>
  </view>

  <input class="search-input" v-model="search" placeholder="🔍  检索战役、人物、话题..." />

  <view class="tag-row">
    <text class="tag" :class="{ active: activeTag === t }" v-for="t in tags" :key="t" @click="activeTag=t">{{ t }}</text>
  </view>

  <view class="post-card" v-for="p in filteredPosts" :key="p.id" @click="openPost(p)">
    <view class="post-top">
      <view class="avatar" :class="p.av"><text>{{ p.avatar }}</text></view>
      <view><text class="author">{{ p.author }}</text><text class="ptime">{{ p.time }}</text></view>
    </view>
    <text class="post-title">{{ p.title }}</text>
    <text class="post-excerpt">{{ p.excerpt }}</text>
    <view class="post-stats"><text>❤️ {{ p.likes }}</text><text>💬 {{ p.comments }}</text><text>📌 {{ p.views }} 阅读</text></view>
  </view>

  <!-- 发帖弹窗 -->
  <view class="modal-overlay" v-if="showEditor" @click="closeEditor"></view>
  <view class="editor-panel" v-if="showEditor">
    <view class="editor-header">
      <text class="editor-title">✦ 发起新讨论</text>
      <text class="editor-close" @click="closeEditor">✕</text>
    </view>
    <view class="field">
      <text class="flabel">标题</text>
      <input class="finp" v-model="form.title" placeholder="请输入讨论标题" maxlength="60" />
    </view>
    <view class="field">
      <text class="flabel">分类</text>
      <view class="cat-row">
        <text class="cat-tag" :class="{ on: form.category === c }" v-for="c in tags" :key="c" @click="form.category = c">{{ c }}</text>
      </view>
    </view>
    <view class="field">
      <text class="flabel">内容</text>
      <textarea class="ftext" v-model="form.content" placeholder="请详细阐述你的观点..." maxlength="2000" />
    </view>
    <view class="btn" @click="submitPost">{{ posting ? '提交中...' : '✦ 投送至档案库' }}</view>
  </view>

  <view class="fab" @click="openEditor">✚</view>
</view>
</template>

<script>
import { db } from '@/utils/data.js'

export default {
  data() {
    return {
      search: '',
      activeTag: '#欧洲战场#',
      tags: ['#欧洲战场#', '#太平洋战争#', '#名将评析#', '#武器装备#', '#战术推演#'],
      posts: [],
      showEditor: false,
      posting: false,
      form: { title: '', category: '#欧洲战场#', content: '' }
    }
  },
  computed: {
    filteredPosts() {
      let list = this.posts
      if (this.search) {
        const kw = this.search.toLowerCase()
        list = list.filter(p => p.title.toLowerCase().includes(kw) || p.excerpt.toLowerCase().includes(kw))
      }
      return list
    }
  },
  async mounted() {
    await this.loadPosts()
  },
  methods: {
    async loadPosts() {
      const data = await db.getPosts()
      if (data) {
        this.posts = data.map(p => ({
          ...p,
          time: this.timeAgo(p.created_at)
        }))
      }
    },
    timeAgo(d) {
      if (!d) return '刚刚'
      const diff = Date.now() - new Date(d).getTime()
      const h = Math.floor(diff / 3600000)
      return h < 1 ? '刚刚' : h < 24 ? h + '小时前' : Math.floor(h / 24) + '天前'
    },
    openPost(p) {
      uni.navigateTo({ url: '/pages/explore/post-detail?id=' + (p._id || p.id) })
    },
    openEditor() {
      this.form = { title: '', category: this.activeTag, content: '' }
      this.showEditor = true
    },
    closeEditor() {
      this.showEditor = false
    },
    async submitPost() {
      const { title, content, category } = this.form
      if (!title.trim()) { uni.showToast({ title: '请输入标题', icon: 'none' }); return }
      if (!content.trim()) { uni.showToast({ title: '请输入内容', icon: 'none' }); return }
      this.posting = true
      const result = await db.createPost({ title: title.trim(), content: content.trim(), category })
      this.posting = false
      if (result) {
        uni.showToast({ title: '发帖成功！', icon: 'success' })
        this.showEditor = false
        await this.loadPosts()
      } else {
        uni.showToast({ title: '发帖失败，请重试', icon: 'none' })
      }
    }
  }
}
</script>

<style scoped>
.page { min-height:100vh; padding:32rpx; padding-bottom:180rpx; background:var(--parchment-light); }
.page-header { margin-bottom:32rpx; }
.overline { font-size:20rpx; letter-spacing:6rpx; color:var(--archive-red); font-family:'Georgia',serif; display:block; margin-bottom:8rpx; }
.title { font-family:'Georgia',serif; font-size:48rpx; color:var(--ink-dark); font-weight:700; display:block; }
.subtitle { font-size:24rpx; color:var(--ink-muted); font-style:italic; display:block; margin-top:8rpx; }
.divider { width:80rpx; height:4rpx; background:var(--archive-red); margin-top:20rpx; opacity:0.6; }

.search-input { width:100%; padding:20rpx 28rpx; border:1px solid var(--parchment-deep); border-radius:40rpx; font-size:26rpx; background:var(--parchment-white); color:var(--ink-dark); margin-bottom:28rpx; }

.tag-row { display:flex; gap:12rpx; flex-wrap:wrap; margin-bottom:28rpx; }
.tag { padding:10rpx 24rpx; border-radius:24rpx; font-size:22rpx; font-family:'Georgia',serif; border:1px solid var(--parchment-deep); color:var(--ink-muted); background:transparent; }
.tag.active { background:var(--archive-red); color:#f4ebd8; border-color:var(--archive-red-dark); }

.post-card { background:var(--parchment-white); border:1px solid rgba(196,182,157,0.5); border-radius:16rpx; padding:28rpx; margin-bottom:20rpx; cursor:pointer; }
.post-card:active { transform:scale(0.985); }
.post-top { display:flex; align-items:center; gap:20rpx; margin-bottom:16rpx; }
.avatar { width:60rpx; height:60rpx; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28rpx; border:2px solid var(--parchment-deep); flex-shrink:0; }
.avatar.av1 { background:#d4c4a8; } .avatar.av2 { background:#c4b89a; } .avatar.av3 { background:#b8a888; }
.author { font-size:26rpx; font-weight:700; color:var(--ink-dark); display:block; }
.ptime { font-size:20rpx; color:var(--ink-muted); font-family:'Georgia',serif; }
.post-title { font-family:'Georgia',serif; font-size:28rpx; font-weight:700; color:var(--ink-dark); display:block; margin-bottom:8rpx; }
.post-excerpt { font-size:24rpx; color:var(--ink-muted); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.post-stats { display:flex; gap:32rpx; margin-top:16rpx; font-size:22rpx; color:var(--ink-soft); font-family:'Georgia',serif; }

/* 发帖弹窗 */
.modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(44,34,26,0.6); z-index:200; }
.editor-panel { position:fixed; bottom:0; left:0; right:0; background:var(--parchment-light); border-radius:32rpx 32rpx 0 0; padding:40rpx 32rpx 60rpx; z-index:201; max-height:85vh; overflow-y:auto; }
.editor-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:32rpx; }
.editor-title { font-family:'Georgia',serif; font-size:32rpx; font-weight:700; color:var(--ink-dark); }
.editor-close { font-size:36rpx; color:var(--ink-muted); padding:8rpx; }
.field { margin-bottom:24rpx; }
.flabel { display:block; font-size:24rpx; color:var(--ink-muted); margin-bottom:12rpx; font-family:'Georgia',serif; font-weight:700; }
.finp { display:block; width:100%; padding:22rpx; border:1.5px solid var(--parchment-deep); border-radius:8rpx; font-size:28rpx; background:var(--parchment-white); color:var(--ink-dark); }
.ftext { display:block; width:100%; height:240rpx; padding:22rpx; border:1.5px solid var(--parchment-deep); border-radius:8rpx; font-size:26rpx; background:var(--parchment-white); color:var(--ink-dark); }
.cat-row { display:flex; gap:12rpx; flex-wrap:wrap; }
.cat-tag { padding:12rpx 24rpx; border-radius:24rpx; font-size:22rpx; border:1px solid var(--parchment-deep); color:var(--ink-muted); background:transparent; }
.cat-tag.on { background:var(--archive-red); color:#f4ebd8; border-color:var(--archive-red-dark); }
.btn { padding:26rpx; background:var(--archive-red); color:#f4ebd8; border:2px solid #5c2a23; border-radius:8rpx; font-size:30rpx; font-weight:700; font-family:'Georgia',serif; text-align:center; box-shadow:4rpx 4rpx 0px rgba(92,42,35,0.6); margin-top:32rpx; }

.fab { position:fixed; bottom:180rpx; right:32rpx; width:96rpx; height:96rpx; border-radius:50%; background:var(--archive-red); color:#fff; font-size:48rpx; display:flex; align-items:center; justify-content:center; box-shadow:0 8rpx 32rpx rgba(122,59,49,0.4); z-index:100; }
</style>
