<template>
<!-- #ifdef H5 -->
<view class="page">
  <view class="status-bar"><text>◉◉◉◉◉</text><text class="stime">{{ statusTime }}</text><text>⚡ ▮▮▮</text></view>

  <view class="page-header">
    <text class="overline">WORLD WAR II · INTERACTIVE ATLAS</text>
    <text class="title">二战历史地图集</text>
    <text class="subtitle">1939 — 1945 · 回望硝烟，铭记历史</text>
    <view class="divider"></view>
  </view>

  <view class="map-card">
    <view class="map-inner" id="mapContainer"></view>
    <view class="map-bar">
      <text class="year-badge">{{ currentYear }}年</text>
      <text class="map-hint">← 滑动时间轴探索 →</text>
    </view>
  </view>

  <view class="card">
    <view class="card-header">
      <text class="card-title">⏳ 时间轴</text>
      <text class="badge-intel">{{ displayDate }}</text>
    </view>
    <slider :value="sliderValue" :min="1939" :max="1946" :step="0.1"
      activeColor="#7a3b31" backgroundColor="#d4c4a8" block-color="#7a3b31"
      @change="onSliderChange" style="width:100%; margin:16rpx 0;" />
    <view class="year-labels">
      <text v-for="y in years" :key="y">{{ y }}</text>
    </view>
  </view>

  <view class="card">
    <view class="card-header">
      <text class="card-title">📜 战役记录</text>
      <text class="badge-classified">CLASSIFIED</text>
    </view>
    <view v-for="ev in visibleEvents" :key="ev.id" class="event-item" @click="focusEvent(ev)">
      <view class="event-dot" :class="ev.type"></view>
      <view class="event-info">
        <text class="event-name">{{ ev.title }}</text>
        <text class="event-date">{{ ev.dateStr }}</text>
      </view>
    </view>
  </view>

  <view class="tab-bar">
    <view class="tab-item active" @click="noop"><text class="tab-icon">🗺️</text><text>态势图</text></view>
    <view class="tab-item" @click="goTab('/pages/classroom/classroom')"><text class="tab-icon">📖</text><text>课堂</text></view>
    <view class="tab-item" @click="goTab('/pages/explore/explore')"><text class="tab-icon">🧭</text><text>探索</text></view>
    <view class="tab-item" @click="goTab('/pages/my/my')"><text class="tab-icon">🎖️</text><text>档案室</text></view>
  </view>
</view>
<!-- #endif -->

<!-- #ifdef APP-PLUS -->
<web-view :src="mapSrc" @message="onMapMessage"></web-view>
<!-- #endif -->
</template>

<script>
// #ifdef H5
import historicalEvents from '@/data/events.js'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// #endif

export default {
  data() {
    return {
      // #ifdef H5
      statusTime: '',
      sliderValue: 1939,
      currentYear: 1939,
      years: [1939,1940,1941,1942,1943,1944,1945,1946],
      map: null,
      markers: [],
      // #endif
      // #ifdef APP-PLUS
      mapSrc: '/static/map.html'
      // #endif
    }
  },
  // #ifdef H5
  computed: {
    displayDate() {
      const y = Math.floor(this.sliderValue)
      const m = Math.floor((this.sliderValue - y) * 12) + 1
      return `${y}年${m}月`
    },
    visibleEvents() {
      return historicalEvents.filter(e => e.year <= this.sliderValue).reverse()
    }
  },
  // #endif
  mounted() {
    // #ifdef H5
    const now = new Date()
    this.statusTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}Z · ARCHIVE`
    this.$nextTick(() => { setTimeout(() => this.initMap(), 300) })
    // #endif
  },
  beforeDestroy() {
    // #ifdef H5
    if (this.map) { this.map.remove(); this.map = null }
    // #endif
  },
  methods: {
    // #ifdef H5
    noop() {},
    goTab(url) { uni.switchTab({ url }) },
    initMap() {
      this.map = L.map('mapContainer', { center:[35,25], zoom:3, minZoom:2, maxZoom:7, zoomControl:false, attributionControl:false })
      L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles'
      }).addTo(this.map)
      L.control.zoom({ position:'bottomright' }).addTo(this.map)
      setTimeout(() => this.map.invalidateSize(), 500)
      this.map.on('moveend zoomend', () => this.updateMarkers())
      this.updateMarkers()
    },
    updateMarkers() {
      if (!this.map) return
      this.markers.forEach(m => this.map.removeLayer(m))
      this.markers = []
      this.visibleEvents.forEach(ev => {
        const copies = this.getLngCopies(ev.lng)
        copies.forEach(lng => {
          const color = ev.type === 'allied' ? '#2c4a6e' : ev.type === 'axis' ? '#8b2a2a' : '#b8935a'
          const m = L.circleMarker([ev.lat, lng], { radius:7, fillColor:color, color:'#fff', weight:1.5, fillOpacity:0.85 }).addTo(this.map)
          m.bindPopup(`<b>${ev.title}</b><br>${ev.dateStr}<br>${ev.desc}`)
          this.markers.push(m)
        })
      })
    },
    getLngCopies(lng) {
      if (!this.map) return [lng]
      const b = this.map.getBounds(), w = b.getWest(), e = b.getEast()
      let base = lng
      while (base - this.map.getCenter().lng > 180) base -= 360
      while (base - this.map.getCenter().lng < -180) base += 360
      const copies = []
      for (let o = -720; o <= 720; o += 360) { const c = base + o; if (c >= w-5 && c <= e+5) copies.push(c) }
      return copies.length ? copies : [base]
    },
    onSliderChange(e) {
      this.sliderValue = e.detail.value
      this.$nextTick(() => this.updateMarkers())
    },
    focusEvent(ev) {
      let base = ev.lng
      while (base - this.map.getCenter().lng > 180) base -= 360
      while (base - this.map.getCenter().lng < -180) base += 360
      this.map.flyTo([ev.lat, base], 6)
      uni.showToast({ title: ev.title + '\n' + ev.desc, icon: 'none', duration: 3000 })
    },
    // #endif

    // #ifdef APP-PLUS
    onMapMessage(e) {
      const msgs = e.detail.data
      if (msgs && msgs.length) {
        const msg = msgs[msgs.length - 1]
        if (msg && msg.action === 'switchTab') {
          uni.switchTab({ url: msg.url })
        }
      }
    }
    // #endif
  }
}
</script>

<!-- H5 样式 -->
<!-- #ifdef H5 -->
<style scoped>
.page { min-height:100vh; padding:32rpx; padding-bottom:140rpx; background:var(--parchment-light); }
.status-bar { display:flex; justify-content:space-between; font-size:22rpx; color:var(--ink-muted); font-family:'Georgia',serif; margin-bottom:24rpx; }
.stime { font-weight:bold; color:var(--ink-body); }
.page-header { margin-bottom:32rpx; }
.overline { font-size:20rpx; letter-spacing:6rpx; color:var(--archive-red); font-family:'Georgia',serif; display:block; margin-bottom:8rpx; }
.title { font-family:'Georgia',serif; font-size:48rpx; color:var(--ink-dark); font-weight:700; display:block; }
.subtitle { font-size:24rpx; color:var(--ink-muted); font-style:italic; display:block; margin-top:8rpx; }
.divider { width:80rpx; height:4rpx; background:var(--archive-red); margin-top:20rpx; opacity:0.6; }
.map-card { background:var(--parchment-white); border:1px solid rgba(196,182,157,0.5); border-radius:16rpx; overflow:hidden; margin-bottom:20rpx; }
.map-inner { width:100%; height:440rpx; }
.map-bar { display:flex; justify-content:space-between; padding:20rpx 28rpx; background:var(--parchment-light); border-top:1px solid rgba(196,182,157,0.3); }
.year-badge { font-family:'Georgia',serif; font-size:36rpx; font-weight:700; color:var(--archive-red); }
.map-hint { font-size:20rpx; color:var(--ink-muted); font-style:italic; }
.card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20rpx; }
.card-title { font-family:'Georgia',serif; font-size:30rpx; font-weight:700; color:var(--ink-dark); }
.badge-intel { font-size:20rpx; padding:6rpx 20rpx; border-radius:20rpx; background:var(--ink-dark); color:var(--brass-light); border:1px solid var(--brass); font-family:'Georgia',serif; font-weight:700; }
.badge-classified { font-size:20rpx; padding:6rpx 20rpx; border-radius:20rpx; background:var(--archive-red); color:#f4ebd8; font-family:'Georgia',serif; font-weight:700; }
.year-labels { display:flex; justify-content:space-between; font-size:20rpx; color:var(--ink-muted); font-family:'Georgia',serif; padding:0 4rpx; }
.event-item { display:flex; align-items:center; gap:20rpx; padding:20rpx 0; border-bottom:1px solid rgba(196,182,157,0.25); cursor:pointer; }
.event-item:last-child { border-bottom:none; }
.event-dot { width:20rpx; height:20rpx; border-radius:50%; flex-shrink:0; }
.event-dot.allied { background:var(--navy); }
.event-dot.axis { background:var(--axis-red); }
.event-dot.neutral { background:#b8935a; }
.event-info { flex:1; min-width:0; }
.event-name { font-size:26rpx; font-weight:600; color:var(--ink-dark); display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.event-date { font-size:20rpx; color:var(--ink-muted); font-family:'Georgia',serif; }
.tab-bar { position:fixed; bottom:0; left:0; right:0; height:120rpx; background:linear-gradient(180deg,#faf7ef,#f0e8d5); display:flex; align-items:flex-start; justify-content:space-around; border-top:1px solid #d4c4a8; z-index:999; padding-top:16rpx; }
.tab-item { display:flex; flex-direction:column; align-items:center; gap:4rpx; font-size:22rpx; color:var(--ink-muted); }
.tab-item.active { color:var(--archive-red); font-weight:700; }
.tab-icon { font-size:40rpx; }
</style>
<!-- #endif -->
