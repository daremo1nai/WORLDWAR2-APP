<template>
<view class="page">
  <!-- 加载中 -->
  <view v-if="loading" class="state-wrap">
    <text class="state-icon">📜</text>
    <text class="state-text">调取档案中...</text>
  </view>

  <!-- 档案未找到 -->
  <view v-else-if="!article" class="state-wrap">
    <text class="state-icon">🔒</text>
    <text class="state-title">档案未解密</text>
    <text class="state-desc">此档案编号不存在或尚未解密，请返回课堂查阅其他档案。</text>
  </view>

  <!-- 文章内容 -->
  <view v-else>
    <!-- 封面 -->
    <view class="cover" :class="coverClass">
      <text class="cover-emoji">{{ article.emoji }}</text>
      <view class="cover-badge">{{ article.category }}</view>
    </view>

    <!-- 标题区 -->
    <view class="header">
      <text class="overline">WAR COLLEGE · DEEP ANALYSIS</text>
      <text class="title">{{ article.title }}</text>
      <view class="divider"></view>
    </view>

    <!-- 元数据栏 -->
    <view class="meta-bar">
      <view class="meta-item">
        <text class="meta-icon">🕐</text>
        <text class="meta-text">{{ article.duration }}</text>
      </view>
      <view class="meta-sep">|</view>
      <view class="meta-item">
        <text class="meta-icon">📖</text>
        <text class="meta-text">{{ article.wordCount }} 字</text>
      </view>
      <view class="meta-sep">|</view>
      <view class="meta-item">
        <text class="meta-icon">👁️</text>
        <text class="meta-text">{{ article.viewCount }} 阅读</text>
      </view>
    </view>

    <!-- 正文 -->
    <view class="body">
      <text class="body-text">{{ article.content }}</text>
    </view>

    <!-- 底部印记 -->
    <view class="footer">
      <view class="footer-divider"></view>
      <text class="footer-text">CLASSIFIED ARCHIVE · 第 {{ article.id }} 号档案</text>
    </view>
  </view>
</view>
</template>

<script>
import { db } from '@/utils/data.js'

export default {
  data() {
    return {
      article: null,
      loading: true,
      coverClass: ''
    }
  },
  async onLoad(options) {
    const id = options.id
    if (!id) {
      this.loading = false
      uni.showToast({ title: '档案编号缺失', icon: 'error' })
      return
    }
    const article = await db.getArticleById(id)
    if (article) {
      this.article = article
      this.coverClass = article.coverColor || 'ac1'
    }
    this.loading = false
  }
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--parchment-light); padding-bottom: 60rpx; }

/* 封面 */
.cover { height: 360rpx; display: flex; align-items: center; justify-content: center; position: relative; }
.cover.ac1 { background: linear-gradient(135deg, #4a3828, #6b5240); }
.cover.ac2 { background: linear-gradient(135deg, #3a4a3a, #5a6b4a); }
.cover.ac3 { background: linear-gradient(135deg, #2c3a4a, #4a5a6b); }
.cover-emoji { font-size: 100rpx; position: relative; z-index: 2; filter: drop-shadow(0 4rpx 12rpx rgba(0,0,0,0.3)); }
.cover-badge { position: absolute; bottom: 24rpx; left: 24rpx; background: rgba(0,0,0,0.5); color: var(--brass-light); padding: 8rpx 20rpx; border-radius: 6rpx; font-size: 20rpx; font-family: 'Georgia', serif; letter-spacing: 2rpx; }

/* 标题区 */
.header { padding: 36rpx 32rpx 0; }
.overline { font-size: 20rpx; letter-spacing: 6rpx; color: var(--archive-red); font-family: 'Georgia', serif; display: block; margin-bottom: 12rpx; }
.title { font-family: 'Georgia', serif; font-size: 40rpx; color: var(--ink-dark); font-weight: 700; display: block; line-height: 1.3; }
.divider { width: 80rpx; height: 4rpx; background: var(--archive-red); margin-top: 24rpx; opacity: 0.6; }

/* 元数据 */
.meta-bar { display: flex; align-items: center; padding: 24rpx 32rpx; border-bottom: 1px solid rgba(196,182,157,0.35); margin: 0 32rpx; }
.meta-item { display: flex; align-items: center; gap: 8rpx; }
.meta-icon { font-size: 22rpx; }
.meta-text { font-size: 22rpx; color: var(--ink-muted); font-family: 'Georgia', serif; }
.meta-sep { margin: 0 20rpx; color: var(--parchment-deep); font-size: 22rpx; }

/* 正文 */
.body { padding: 36rpx 32rpx; }
.body-text { font-size: 28rpx; line-height: 1.9; color: var(--ink-body); white-space: pre-wrap; font-family: 'Georgia', 'Noto Serif SC', 'PingFang SC', serif; }

/* 底部 */
.footer { padding: 48rpx 32rpx 32rpx; text-align: center; }
.footer-divider { width: 80rpx; height: 2rpx; background: var(--parchment-deep); margin: 0 auto 20rpx; opacity: 0.5; }
.footer-text { font-size: 20rpx; color: var(--ink-soft); font-family: 'Georgia', serif; letter-spacing: 2rpx; }

/* 状态页 */
.state-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; padding: 32rpx; }
.state-icon { font-size: 80rpx; margin-bottom: 24rpx; }
.state-title { font-family: 'Georgia', serif; font-size: 32rpx; color: var(--ink-dark); font-weight: 700; margin-bottom: 12rpx; }
.state-text { font-size: 26rpx; color: var(--ink-muted); }
.state-desc { font-size: 24rpx; color: var(--ink-muted); text-align: center; line-height: 1.6; max-width: 480rpx; }
</style>
