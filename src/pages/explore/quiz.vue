<template>
<view class="page">
  <view class="page-header">
    <text class="overline">INTELLIGENCE BRIEFING</text>
    <text class="title">情报测验</text>
    <text class="subtitle">测测你的二战知识储备</text>
    <view class="divider"></view>
  </view>

  <!-- 进度 -->
  <view class="progress-bar-wrap" v-if="!submitted">
    <view class="progress-bar"><view class="fill" :style="{ width: progress + '%' }"></view></view>
    <text class="progress-text">{{ answered }}/{{ questions.length }}</text>
  </view>

  <!-- 题目 -->
  <view class="quiz-card" v-for="(q, qi) in questions" :key="q.id">
    <view class="q-meta">
      <text class="q-diff" :class="q.difficulty">{{ diffLabel(q.difficulty) }}</text>
      <text class="q-cat">{{ q.category }}</text>
    </view>
    <text class="q-text">{{ qi + 1 }}. {{ q.question }}</text>
    <view class="q-options">
      <view class="q-opt" v-for="(opt, oi) in q.options" :key="oi"
        :class="{ selected: !submitted && q.selected === oi, correct: submitted && q._isCorrect, wrong: submitted && q.selected === oi && !q._isCorrect }"
        @click="selectAnswer(q, oi)">
        {{ opt }}
      </view>
    </view>
    <view class="q-explanation" v-if="submitted && q._isCorrect !== undefined">
      <text class="q-exp-title">{{ q._isCorrect ? '✅ 回答正确！' : '❌ 回答错误' }}</text>
      <text class="q-exp-text">{{ q.explanation }}</text>
    </view>
  </view>

  <view class="btn-primary" @click="submitQuiz" v-if="!submitted">
    {{ submitted ? '已提交' : '✦ 提交情报答卷' }}
  </view>

  <!-- 提交后的成绩 -->
  <view class="result-panel" v-if="submitted && score !== null">
    <text class="result-title">📋 情报评估报告</text>
    <view class="score-row">
      <text class="score-num">{{ score.correct }}/{{ score.total }}</text>
      <text class="score-label">正确率 {{ score.percent }}%</text>
    </view>
    <view class="btn-secondary" @click="retakeQuiz">✦ 重新测验</view>
  </view>

  <!-- 历史记录 -->
  <view class="history-section" v-if="history.length > 0">
    <text class="section-label">📜 历史记录</text>
    <view class="history-item" v-for="(h, hi) in history.slice(0, 5)" :key="hi">
      <text class="h-time">{{ h.time }}</text>
      <text class="h-score">{{ h.correct }}/{{ h.total }}</text>
      <text class="h-pct">{{ h.percent }}%</text>
    </view>
  </view>
</view>
</template>

<script>
import { db } from '@/utils/data.js'

export default {
  data() {
    return {
      questions: [],
      submitted: false,
      score: null,
      history: []
    }
  },
  computed: {
    answered() { return this.questions.filter(q => q.selected !== undefined).length },
    progress() { return this.questions.length ? (this.answered / this.questions.length) * 100 : 0 }
  },
  async mounted() {
    const data = await db.getQuiz()
    if (data) this.questions = data
    this.loadHistory()
  },
  methods: {
    diffLabel(d) { return d === 'easy' ? '初级' : d === 'medium' ? '中级' : '高级' },
    selectAnswer(q, idx) {
      if (this.submitted) return
      q.selected = idx
    },
    async submitQuiz() {
      if (this.submitted) return
      const answers = this.questions
        .filter(q => q.selected !== undefined)
        .map(q => ({ questionId: q.id, userAnswer: q.selected }))
      if (answers.length === 0) {
        uni.showToast({ title: '请至少作答一题', icon: 'none' })
        return
      }
      this.submitted = true
      const result = await db.submitQuiz(answers)
      // 将服务端结果合并回题目
      if (result && result.results) {
        result.results.forEach(r => {
          const q = this.questions.find(q => q.id == r.questionId)
          if (q) q._isCorrect = r.isCorrect
        })
      } else {
        // 兜底：无 results 的旧版返回
        this.questions.forEach(q => { if (q.selected !== undefined) q._isCorrect = true })
      }
      this.score = {
        total: result.total,
        correct: result.correct,
        percent: Math.round((result.correct / result.total) * 100)
      }
      this.saveHistory()
      uni.showToast({ title: `答对 ${result.correct}/${result.total} 题！`, icon: 'success', duration: 2500 })
    },
    retakeQuiz() {
      this.submitted = false
      this.score = null
      this.questions = this.questions.map(q => ({ ...q, selected: undefined, _isCorrect: undefined }))
    },
    loadHistory() {
      try {
        this.history = uni.getStorageSync('wwii_quizHistory') || []
      } catch(e) { this.history = [] }
    },
    saveHistory() {
      this.history.unshift({
        time: new Date().toLocaleString(),
        correct: this.score.correct,
        total: this.score.total,
        percent: this.score.percent
      })
      if (this.history.length > 20) this.history = this.history.slice(0, 20)
      uni.setStorageSync('wwii_quizHistory', this.history)
    }
  }
}
</script>

<style scoped>
.page { min-height:100vh; padding:32rpx; padding-bottom:80rpx; background:var(--parchment-light); }
.page-header { margin-bottom:32rpx; }
.overline { font-size:20rpx; letter-spacing:6rpx; color:var(--archive-red); font-family:'Georgia',serif; display:block; margin-bottom:8rpx; }
.title { font-family:'Georgia',serif; font-size:48rpx; color:var(--ink-dark); font-weight:700; display:block; }
.subtitle { font-size:24rpx; color:var(--ink-muted); font-style:italic; display:block; margin-top:8rpx; }
.divider { width:80rpx; height:4rpx; background:var(--archive-red); margin-top:20rpx; opacity:0.6; }

.progress-bar-wrap { display:flex; align-items:center; gap:20rpx; margin-bottom:28rpx; }
.progress-bar { flex:1; height:6rpx; background:var(--parchment-deep); border-radius:3rpx; overflow:hidden; }
.fill { height:100%; background:var(--archive-red); border-radius:3rpx; transition:width 0.3s; }
.progress-text { font-size:22rpx; color:var(--ink-muted); font-family:'Georgia',serif; }

.quiz-card { background:var(--parchment-white); border:1px solid rgba(196,182,157,0.5); border-radius:16rpx; padding:36rpx; margin-bottom:24rpx; }
.q-meta { display:flex; justify-content:space-between; margin-bottom:20rpx; }
.q-diff { font-size:20rpx; padding:6rpx 20rpx; border-radius:20rpx; font-weight:700; font-family:'Georgia',serif; }
.q-diff.easy { background:#e8ecf2; color:var(--navy); }
.q-diff.medium { background:#f4ecd8; color:#8b6d3f; }
.q-diff.hard { background:#f0dede; color:var(--axis-red); }
.q-cat { font-size:20rpx; color:var(--ink-muted); font-family:'Georgia',serif; }
.q-text { font-size:28rpx; font-weight:600; color:var(--ink-dark); line-height:1.6; display:block; margin-bottom:24rpx; }
.q-options { display:flex; flex-direction:column; gap:16rpx; }
.q-opt { padding:22rpx 28rpx; border:1.5px solid var(--parchment-deep); border-radius:8rpx; font-size:26rpx; color:var(--ink-body); background:var(--parchment-white); }
.q-opt.selected { border-color:var(--archive-red); background:#faf0ed; color:var(--archive-red); font-weight:600; }
.q-opt.correct { border-color:#3a6b4a; background:#eaf2ec; color:#2a4a35; font-weight:600; }
.q-opt.wrong { border-color:var(--axis-red); background:#faf0f0; color:#7a2a2a; }
.q-explanation { margin-top:24rpx; padding:24rpx; background:rgba(196,182,157,0.15); border-radius:8rpx; }
.q-exp-title { font-size:26rpx; font-weight:700; color:var(--ink-dark); display:block; margin-bottom:8rpx; }
.q-exp-text { font-size:24rpx; color:var(--ink-muted); line-height:1.5; }

.btn-primary { margin-top:16rpx; padding:26rpx; background:var(--archive-red); color:#f4ebd8; border:2px solid #5c2a23; border-radius:8rpx; font-size:30rpx; font-weight:700; font-family:'Georgia',serif; text-align:center; }
.btn-secondary { margin-top:24rpx; padding:20rpx; background:transparent; color:var(--archive-red); border:2px solid var(--archive-red); border-radius:8rpx; font-size:26rpx; font-weight:700; font-family:'Georgia',serif; text-align:center; }

.result-panel { background:var(--parchment-white); border:2px solid var(--brass); border-radius:16rpx; padding:40rpx; margin-top:32rpx; text-align:center; }
.result-title { font-family:'Georgia',serif; font-size:32rpx; font-weight:700; color:var(--ink-dark); display:block; margin-bottom:24rpx; }
.score-row { margin-bottom:8rpx; }
.score-num { font-family:'Georgia',serif; font-size:80rpx; font-weight:700; color:var(--archive-red); display:block; }
.score-label { font-size:26rpx; color:var(--ink-muted); font-family:'Georgia',serif; }

.history-section { margin-top:48rpx; }
.section-label { font-family:'Georgia',serif; font-size:28rpx; font-weight:700; color:var(--ink-dark); display:block; margin-bottom:20rpx; }
.history-item { display:flex; justify-content:space-between; align-items:center; padding:20rpx 28rpx; background:var(--parchment-white); border:1px solid rgba(196,182,157,0.3); border-radius:12rpx; margin-bottom:12rpx; }
.h-time { font-size:22rpx; color:var(--ink-muted); }
.h-score { font-family:'Georgia',serif; font-size:26rpx; font-weight:700; color:var(--ink-dark); }
.h-pct { font-size:22rpx; color:var(--archive-red); font-weight:700; }
</style>
