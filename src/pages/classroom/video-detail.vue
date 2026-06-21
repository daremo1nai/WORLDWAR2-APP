<template>
<view class="page">
  <!-- 加载中 -->
  <view v-if="loading" class="state-wrap">
    <text class="state-icon">🎞️</text>
    <text class="state-text">调取档案中...</text>
  </view>

  <!-- 档案未找到 -->
  <view v-else-if="!video" class="state-wrap">
    <text class="state-icon">🔒</text>
    <text class="state-title">档案未解密</text>
    <text class="state-desc">此影像档案不存在或尚未解密，请返回课堂查阅其他档案。</text>
  </view>

  <!-- 视频内容 -->
  <view v-else>
    <!-- 播放器 -->
    <view class="player-wrap">
      <video
        class="player"
        :src="video.videoUrl"
        controls
        :autoplay="false"
        object-fit="contain"
        :title="video.title"
        @error="onVideoError"
      ></video>
    </view>

    <!-- 标题区 -->
    <view class="header">
      <text class="overline">WAR COLLEGE · DOCUMENTARY</text>
      <text class="title">{{ video.title }}</text>
      <view class="divider"></view>
    </view>

    <!-- 元数据栏 -->
    <view class="meta-bar">
      <view class="meta-item">
        <text class="meta-icon">🕐</text>
        <text class="meta-text">{{ video.duration }}</text>
      </view>
      <view class="meta-sep">|</view>
      <view class="meta-item">
        <text class="meta-icon">⭐</text>
        <text class="meta-text">{{ video.rating }}</text>
      </view>
      <view class="meta-sep">|</view>
      <view class="meta-item">
        <text class="meta-icon">▶</text>
        <text class="meta-text">{{ video.plays }} 播放</text>
      </view>
    </view>

    <!-- 简介 -->
    <view class="desc-card">
      <text class="desc-title">📋 档案简介</text>
      <text class="desc-text">{{ video.description || video.excerpt }}</text>
    </view>

    <!-- 底部印记 -->
    <view class="footer">
      <view class="footer-divider"></view>
      <text class="footer-text">ARCHIVAL FOOTAGE · 第 {{ video.id }} 号档案</text>
    </view>
  </view>
</view>
</template>

<script>
import { db } from '@/utils/data.js'

export default {
  data() {
    return {
      video: null,
      loading: true
    }
  },
  async onLoad(options) {
    const id = options.id
    if (!id) {
      this.loading = false
      uni.showToast({ title: '档案编号缺失', icon: 'error' })
      return
    }
    const video = await db.getArticleById(id)
    if (video) {
      this.video = video
    }
    this.loading = false
  },
  methods: {
    onVideoError(e) {
      uni.showToast({ title: '视频加载失败，请稍后重试', icon: 'none' })
    }
  }
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--parchment-light); padding-bottom: 60rpx; }

/* 播放器 */
.player-wrap { background: var(--ink-black); }
.player { width: 100%; height: 440rpx; display: block; }

/* 标题区 */
.header { padding: 36rpx 32rpx 0; }
.overline { font-size: 20rpx; letter-spacing: 6rpx; color: var(--archive-red); font-family: 'Georgia', serif; display: block; margin-bottom: 12rpx; }
.title { font-family: 'Georgia', serif; font-size: 40rpx; color: var(--ink-dark); font-weight: 700; display: block; line-height: 1.3; }
.divider { width: 80rpx; height: 4rpx; background: var(--archive-red); margin-top: 24rpx; opacity: 0.6; }

/* 元数据 */
.meta-bar { display: flex; align-items: center; padding: 24rpx 32rpx; border-bottom: 1px solid rgba(196,182,157,0.35); margin: 0 32rpx 24rpx; }
.meta-item { display: flex; align-items: center; gap: 8rpx; }
.meta-icon { font-size: 22rpx; }
.meta-text { font-size: 22rpx; color: var(--ink-muted); font-family: 'Georgia', serif; }
.meta-sep { margin: 0 20rpx; color: var(--parchment-deep); font-size: 22rpx; }

/* 简介 */
.desc-card { margin: 0 32rpx 48rpx; padding: 28rpx; background: var(--parchment-white); border: 1px solid rgba(196,182,157,0.5); border-radius: 16rpx; }
.desc-title { font-family: 'Georgia', serif; font-size: 28rpx; font-weight: 700; color: var(--ink-dark); display: block; margin-bottom: 16rpx; }
.desc-text { font-size: 26rpx; line-height: 1.7; color: var(--ink-body); font-family: 'Georgia', 'Noto Serif SC', 'PingFang SC', serif; white-space: pre-wrap; }

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
