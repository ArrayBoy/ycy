<template>
  <article v-if="song" class="song-detail">
    <header class="song-detail__hero">
      <div class="song-detail__title-row">
        <div class="song-detail__title-wrap">
          <p class="song-detail__eyebrow">{{ song.tag }} · {{ song.age }}</p>
          <h1 class="song-detail__title">{{ song.title }}</h1>
        </div>
        <button
          class="song-detail__fav"
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
      <p class="song-detail__summary">{{ song.summary }}</p>
      <p class="song-detail__time">大约 {{ song.minutes }} 分钟唱完</p>
    </header>

    <div class="song-detail__font-bar">
      <button class="song-detail__font-btn" type="button" @click="enlargeFont">放大歌词</button>
      <button
        class="song-detail__font-btn"
        type="button"
        :disabled="isDefaultFont"
        @click="resetFont"
      >
        还原默认
      </button>
      <span class="song-detail__font-hint">{{ fontSize }}px</span>
    </div>

    <div class="song-detail__body" :style="{ '--lyric-fs': `${fontSize}px` }">
      <p v-for="(line, i) in song.lyrics" :key="i" class="song-detail__line">{{ line }}</p>
    </div>

    <footer class="song-detail__footer">
      <p>唱完啦，再来一首更开心</p>
      <button class="song-detail__again" type="button" @click="goList">再选一首儿歌</button>
    </footer>

    <div v-if="toastVisible" class="erge-toast">{{ toastText }}</div>
  </article>
  <div v-else class="song-empty">没有找到这首儿歌</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LYRIC_FONT_DEFAULT,
  LYRIC_FONT_MAX,
  getSongById,
  isFavorite,
  parseRouteParam,
  readLyricFontSize,
  saveLyricFontSize,
  toggleFavorite,
} from '../config'

const route = useRoute()
const router = useRouter()

const fontSize = ref(readLyricFontSize())
const favorited = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const isDefaultFont = computed(() => fontSize.value === LYRIC_FONT_DEFAULT)

const songId = computed(() => {
  const id = Number(parseRouteParam(route.params.id))
  return Number.isInteger(id) && id > 0 ? id : null
})

const song = computed(() => (songId.value === null ? null : getSongById(songId.value)))

watch(
  songId,
  (id) => {
    favorited.value = id !== null && isFavorite(id)
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

function onToggleFavorite() {
  if (songId.value === null) return
  favorited.value = toggleFavorite(songId.value)
  showToast(favorited.value ? '收藏成功' : '取消收藏成功')
}

function enlargeFont() {
  if (fontSize.value >= LYRIC_FONT_MAX) return
  fontSize.value += 1
  saveLyricFontSize(fontSize.value)
}

function resetFont() {
  fontSize.value = LYRIC_FONT_DEFAULT
  saveLyricFontSize(fontSize.value)
}

function goList() {
  router.push({ name: 'erge' })
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
