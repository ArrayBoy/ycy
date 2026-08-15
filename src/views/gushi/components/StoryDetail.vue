<template>
  <article v-if="story" class="story-detail">
    <header class="story-detail__hero">
      <div class="story-detail__title-row">
        <div class="story-detail__title-wrap">
          <p class="story-detail__eyebrow">{{ story.tag }} · {{ story.age }}</p>
          <h1 class="story-detail__title">{{ story.title }}</h1>
        </div>
        <button
          class="story-detail__fav"
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
      <p class="story-detail__summary">{{ story.summary }}</p>
      <p class="story-detail__time">
        大约 {{ story.minutes }} 分钟读完 · 全文 {{ storyCharCount }} 个字
      </p>
    </header>

    <div class="story-detail__font-bar">
      <button class="story-detail__font-btn" type="button" @click="enlargeFont">放大字体</button>
      <button
        class="story-detail__font-btn"
        type="button"
        :disabled="isDefaultFont"
        @click="resetFont"
      >
        还原默认
      </button>
      <span class="story-detail__font-hint">{{ fontSize }}px</span>
    </div>

    <div class="story-detail__body" :style="{ '--story-fs': `${fontSize}px` }">
      <p v-for="(para, i) in story.content" :key="i" class="story-detail__para">
        {{ para }}
      </p>
    </div>

    <footer class="story-detail__footer">
      <p>讲完啦，给宝宝一个晚安拥抱吧</p>
      <div class="story-detail__footer-actions">
        <button class="story-detail__again" type="button" @click="goPrev">上一个故事</button>
        <button class="story-detail__again story-detail__next" type="button" @click="goNext">
          下一个故事
        </button>
      </div>
    </footer>

    <div v-if="toastVisible" class="gushi-toast">{{ toastText }}</div>
  </article>
  <div v-else class="story-empty">没有找到这个故事</div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  STORY_FONT_DEFAULT,
  STORY_FONT_MAX,
  getNextStoryId,
  getPrevStoryId,
  getStoryById,
  isFavorite,
  parseRouteParam,
  readStoryFontSize,
  saveStoryFontSize,
  toggleFavorite,
} from '../config'

const route = useRoute()
const router = useRouter()

const fontSize = ref(readStoryFontSize())
const favorited = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const isDefaultFont = computed(() => fontSize.value === STORY_FONT_DEFAULT)

const storyId = computed(() => {
  const id = Number(parseRouteParam(route.params.id))
  return Number.isInteger(id) && id > 0 ? id : null
})

const story = computed(() => (storyId.value === null ? null : getStoryById(storyId.value)))

const nextStoryId = computed(() => (storyId.value === null ? null : getNextStoryId(storyId.value)))

const prevStoryId = computed(() => (storyId.value === null ? null : getPrevStoryId(storyId.value)))

const storyCharCount = computed(() => {
  if (!story.value) return 0
  return story.value.content.join('').replace(/\s/g, '').length
})

watch(
  storyId,
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
  if (storyId.value === null) return
  favorited.value = toggleFavorite(storyId.value)
  showToast(favorited.value ? '收藏成功' : '取消收藏成功')
}

function enlargeFont() {
  if (fontSize.value >= STORY_FONT_MAX) return
  fontSize.value += 1
  saveStoryFontSize(fontSize.value)
}

function resetFont() {
  fontSize.value = STORY_FONT_DEFAULT
  saveStoryFontSize(fontSize.value)
}

function goPrev() {
  if (prevStoryId.value === null) return
  router.push({ name: 'gushi-detail', params: { id: String(prevStoryId.value) } })
}

function goNext() {
  if (nextStoryId.value === null) return
  router.push({ name: 'gushi-detail', params: { id: String(nextStoryId.value) } })
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
