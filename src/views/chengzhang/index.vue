<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { pageConfig } from './config'
import './index.scss'

const images = pageConfig.images
const playMs = pageConfig.playMs

const index = ref(0)
const playing = ref(false)
const dragging = ref(false)
const dragOffset = ref(0)
const stageRef = ref<HTMLElement | null>(null)
/** 已加载过的图片下标，避免来回切换重复请求 */
const loadedIndexes = ref(new Set<number>([0]))

let timer: ReturnType<typeof setInterval> | null = null
let startX = 0
let startY = 0
let deltaX = 0
let touchDragging = false
let locked = false

const counterText = computed(() => `${index.value + 1} / ${images.length}`)

const trackStyle = computed(() => {
  const base = -index.value * 100
  if (dragging.value) {
    const width = stageRef.value?.clientWidth || 1
    return {
      transform: `translateX(${base + (dragOffset.value / width) * 100}%)`,
      transition: 'none',
    }
  }
  return {
    transform: `translateX(${base}%)`,
  }
})

function markLoadedAround(i: number) {
  const next = new Set(loadedIndexes.value)
  next.add(i)
  if (i > 0) next.add(i - 1)
  if (i < images.length - 1) next.add(i + 1)
  loadedIndexes.value = next
}

function isLoaded(i: number) {
  return loadedIndexes.value.has(i)
}

watch(index, (i) => markLoadedAround(i), { immediate: true })

function goTo(i: number) {
  if (!images.length) return
  if (i < 0) i = images.length - 1
  if (i >= images.length) i = 0
  index.value = i
}

function stopAuto() {
  playing.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function startAuto() {
  playing.value = true
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    goTo(index.value + 1)
  }, playMs)
}

function restartAuto() {
  if (playing.value) startAuto()
}

function togglePlay() {
  if (playing.value) stopAuto()
  else startAuto()
}

function onPrev() {
  goTo(index.value - 1)
  restartAuto()
}

function onNext() {
  goTo(index.value + 1)
  restartAuto()
}

function onDot(i: number) {
  goTo(i)
  restartAuto()
}

function onTouchStart(e: TouchEvent) {
  if (!e.touches.length) return
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  deltaX = 0
  touchDragging = true
  locked = false
  dragging.value = true
  dragOffset.value = 0
}

function onTouchMove(e: TouchEvent) {
  if (!touchDragging || !e.touches.length) return
  const dx = e.touches[0].clientX - startX
  const dy = e.touches[0].clientY - startY
  if (!locked) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    locked = Math.abs(dx) > Math.abs(dy)
    if (!locked) {
      touchDragging = false
      dragging.value = false
      return
    }
  }
  deltaX = dx
  dragOffset.value = dx
}

function onTouchEnd() {
  if (!touchDragging && !dragging.value) return
  touchDragging = false
  dragging.value = false
  const width = stageRef.value?.clientWidth || 1
  const threshold = width * 0.18
  if (deltaX < -threshold) goTo(index.value + 1)
  else if (deltaX > threshold) goTo(index.value - 1)
  dragOffset.value = 0
  deltaX = 0
  restartAuto()
}

onBeforeUnmount(() => {
  stopAuto()
})
</script>

<template>
  <div class="chengzhang-page">
    <div class="chengzhang-page__topbar">
      <RouterLink class="chengzhang-page__home" to="/">‹ 返回首页</RouterLink>
      <div class="chengzhang-page__counter">{{ counterText }}</div>
    </div>

    <div v-if="!images.length" class="chengzhang-page__empty">
      <p>还没有成长照片</p>
      <p>把图片放到 images 文件夹即可</p>
    </div>

    <div
      v-else
      ref="stageRef"
      class="chengzhang-page__stage"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="chengzhang-page__track" :class="{ dragging }" :style="trackStyle">
        <div v-for="(src, i) in images" :key="src" class="chengzhang-page__slide">
          <img
            v-if="isLoaded(i)"
            :src="src"
            :alt="`成长照片 ${i + 1}`"
            decoding="async"
            :fetchpriority="i === index ? 'high' : 'low'"
          />
          <div v-else class="chengzhang-page__placeholder" aria-hidden="true">加载中</div>
        </div>
      </div>

      <button class="chengzhang-page__nav prev" type="button" aria-label="上一张" @click="onPrev">
        ‹
      </button>
      <button class="chengzhang-page__nav next" type="button" aria-label="下一张" @click="onNext">
        ›
      </button>
    </div>

    <div v-if="images.length" class="chengzhang-page__controls">
      <div class="chengzhang-page__dots">
        <button
          v-for="(_, i) in images"
          :key="i"
          type="button"
          class="chengzhang-page__dot"
          :class="{ active: i === index }"
          :aria-label="`第 ${i + 1} 张`"
          @click="onDot(i)"
        />
      </div>
      <button class="chengzhang-page__play" type="button" @click="togglePlay">
        {{ playing ? '暂停播放' : '自动播放' }}
      </button>
    </div>
  </div>
</template>
