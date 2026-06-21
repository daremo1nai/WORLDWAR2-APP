<template>
<view class="page">
  <!-- 头部 -->
  <view class="page-header">
    <view class="back-row" @click="goBack">
      <text class="back-arrow">←</text>
      <text class="back-text">返回研讨列表</text>
    </view>
  </view>

  <view v-if="post" class="content">
    <!-- 分类标签 -->
    <text class="cat-badge">{{ post.category }}</text>

    <!-- 标题 -->
    <text class="post-title">{{ post.title }}</text>

    <!-- 作者信息 -->
    <view class="author-row">
      <view class="avatar" :class="post.av || 'av1'"><text>{{ post.avatar || '📝' }}</text></view>
      <view>
        <text class="author-name">{{ post.author }}</text>
        <text class="post-time">{{ timeAgo(post.created_at) }}</text>
      </view>
    </view>

    <view class="divider"></view>

    <!-- 正文 -->
    <text class="post-body">{{ post.content }}</text>

    <!-- 互动栏 -->
    <view class="action-bar">
      <view class="action-item" @click="doLike">
        <text class="action-icon">❤️</text>
        <text>{{ post.like_count || post.likes || 0 }}</text>
      </view>
      <view class="action-item">
        <text class="action-icon">💬</text>
        <text>{{ post.comment_count || post.comments || 0 }}</text>
      </view>
      <view class="action-item">
        <text class="action-icon">📌</text>
        <text>{{ post.view_count || 0 }} 阅读</text>
      </view>
    </view>
  </view>

  <!-- 加载中 -->
  <view v-else class="loading">
    <text>正在解密档案...</text>
  </view>
</view>
</template>

<script>
import { db } from '@/utils/data.js'

export default {
  data() {
    return {
      post: null
    }
  },
  onLoad(options) {
    const id = options.id
    if (id) this.loadPost(id)
  },
  methods: {
    async loadPost(id) {
      const p = await db.getPostById(id)
      if (p) {
        this.post = {
          ...p,
          av: p.av || ('av' + ((p.id % 3) + 1)),
          avatar: p.avatar || '📝'
        }
      } else {
        uni.showToast({ title: '档案未找到', icon: 'none' })
        setTimeout(() => this.goBack(), 1000)
      }
    },
    timeAgo(d) {
      if (!d) return '未知时间'
      const diff = Date.now() - new Date(d).getTime()
      const h = Math.floor(diff / 3600000)
      return h < 1 ? '刚刚' : h < 24 ? h + '小时前' : Math.floor(h / 24) + '天前'
    },
    doLike() {
      uni.showToast({ title: '👍 已标记为重要情报', icon: 'none' })
    },
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.page { min-height:100vh; padding:32rpx; background:var(--parchment-light); }
.page-header { margin-bottom:32rpx; }
.back-row { display:flex; align-items:center; gap:12rpx; padding:16rpx 0; }
.back-arrow { font-size:36rpx; color:var(--archive-red); }
.back-text { font-size:26rpx; color:var(--ink-muted); font-family:'Georgia',serif; }

.content { background:var(--parchment-white); border:1px solid rgba(196,182,157,0.5); border-radius:16rpx; padding:40rpx; }
.cat-badge { display:inline-block; font-size:20rpx; padding:6rpx 20rpx; border-radius:16rpx; background:var(--archive-red); color:#f4ebd8; font-family:'Georgia',serif; margin-bottom:24rpx; }
.post-title { font-family:'Georgia',serif; font-size:40rpx; font-weight:700; color:var(--ink-dark); display:block; line-height:1.3; margin-bottom:28rpx; }

.author-row { display:flex; align-items:center; gap:20rpx; }
.avatar { width:72rpx; height:72rpx; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:32rpx; border:2px solid var(--parchment-deep); flex-shrink:0; }
.avatar.av1 { background:#d4c4a8; }
.avatar.av2 { background:#c4b89a; }
.avatar.av3 { background:#b8a888; }
.author-name { font-size:28rpx; font-weight:700; color:var(--ink-dark); display:block; }
.post-time { font-size:22rpx; color:var(--ink-muted); font-family:'Georgia',serif; }

.divider { width:100%; height:1px; background:rgba(196,182,157,0.3); margin:28rpx 0; }

.post-body { font-size:28rpx; color:var(--ink-body); line-height:1.9; white-space:pre-wrap; }

.action-bar { display:flex; gap:48rpx; margin-top:40rpx; padding-top:28rpx; border-top:1px solid rgba(196,182,157,0.3); }
.action-item { display:flex; align-items:center; gap:8rpx; font-size:26rpx; color:var(--ink-muted); font-family:'Georgia',serif; }
.action-icon { font-size:32rpx; }

.loading { display:flex; justify-content:center; padding:200rpx 0; font-size:28rpx; color:var(--ink-muted); font-family:'Georgia',serif; font-style:italic; }
</style>
