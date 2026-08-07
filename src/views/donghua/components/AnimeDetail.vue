<template>
  <article v-if="item" class="anime-detail">
    <header class="anime-detail__hero">
      <div class="anime-detail__title-row">
        <div class="anime-detail__title-wrap">
          <p class="anime-detail__eyebrow">{{ item.tag }} · {{ item.age }}</p>
          <h1 class="anime-detail__title">{{ item.title }}</h1>
        </div>
        <button
          class="anime-detail__fav"
          type="button"
          :class="{ active: favorited }"
          :aria-label="favorited ? '取消收藏' : '收藏'"
          @click="onToggleFavorite"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 17.3l-5.4 3.2 1.4-6.1L3.5 9.9l6.2-.5L12 3.5l2.3 5.9 6.2.5-4.5 4.5 1.4 6.1z"
            />
          </svg>
        </button>
      </div>
      <p class="anime-detail__summary">{{ item.summary }}</p>
      <p class="anime-detail__time">大约 {{ item.minutes }} 分钟</p>
    </header>

    <div
      class="anime-detail__player"
      :class="{
        'is-fullscreen': isFullscreen,
        'is-landscape-fs': isLandscapeFs,
      }"
    >
      <iframe
        class="anime-detail__iframe"
        :src="playUrl"
        title="动画播放"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <button
        class="anime-detail__fs-btn"
        type="button"
        :aria-label="isFullscreen ? '退出全屏' : '全屏'"
        @click="toggleFullscreen"
      >
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>

    <p class="anime-detail__demo-tip">播放来自 YouTube 公开视频，可在配置中替换为自有动画链接</p>

    <footer class="anime-detail__footer">
      <button class="anime-detail__again" type="button" @click="goList">再选一部动画</button>
    </footer>

    <div v-if="toastVisible" class="donghua-toast">{{ toastText }}</div>
  </article>
  <div v-else class="anime-empty">没有找到这部动画</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getAnimeById,
  getPlayUrl,
  isFavorite,
  parseRouteParam,
  toggleFavorite,
} from '../config'

const route = useRoute()
const router = useRouter()

const favorited = ref(false)
const isFullscreen = ref(false)
const isLandscapeFs = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
let previousOverflow = ''

const animeId = computed(() => {
  const id = Number(parseRouteParam(route.params.id))
  return Number.isInteger(id) && id > 0 ? id : null
})

const item = computed(() => (animeId.value === null ? null : getAnimeById(animeId.value)))
const playUrl = computed(() => getPlayUrl(item.value))

watch(
  animeId,
  (id) => {
    favorited.value = id !== null && isFavorite(id)
    exitFullscreen()
  },
  { immediate: true },
)

function showToast(text: string) {
  toastText.value = text
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 1600)
}

function isPortraitPhone() {
  return window.matchMedia('(orientation: portrait)').matches
}

async function lockLandscape() {
  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (type: string) => Promise<void>
    }
    await orientation.lock?.('landscape')
  } catch {
    // iOS 等不支持时忽略，改用 CSS 横屏
  }
}

async function unlockOrientation() {
  try {
    screen.orientation?.unlock?.()
  } catch {
    // ignore
  }
}

async function enterFullscreen() {
  isFullscreen.value = true
  isLandscapeFs.value = isPortraitPhone()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.documentElement.classList.add('anime-fs-active')
  await lockLandscape()
}

async function exitFullscreen() {
  if (!isFullscreen.value) return
  isFullscreen.value = false
  isLandscapeFs.value = false
  document.body.style.overflow = previousOverflow
  document.documentElement.classList.remove('anime-fs-active')
  await unlockOrientation()
}

async function toggleFullscreen() {
  if (isFullscreen.value) await exitFullscreen()
  else await enterFullscreen()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isFullscreen.value) void exitFullscreen()
}

function onToggleFavorite() {
  if (animeId.value === null) return
  favorited.value = toggleFavorite(animeId.value)
  showToast(favorited.value ? '收藏成功' : '取消收藏成功')
}

function goList() {
  router.push({ name: 'donghua' })
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
  document.removeEventListener('keydown', onKeydown)
  exitFullscreen()
})
</script>
