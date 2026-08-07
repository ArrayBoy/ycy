<template>
  <div class="story-list-page">
    <div class="story-toolbar">
      <TagSelect v-model="selectedTag" :options="tags" />
      <button
        class="story-fav-toggle"
        type="button"
        :class="{ active: favoritesOnly }"
        @click="favoritesOnly = !favoritesOnly"
      >
        {{ favoritesOnly ? '全部故事' : '我的收藏' }}
      </button>
    </div>

    <p class="story-list-count">
      {{ listTitle }} · {{ filteredStories.length }} 个
    </p>

    <div v-if="!filteredStories.length" class="story-empty">
      {{ favoritesOnly ? '还没有收藏故事' : '没有符合筛选的故事' }}
    </div>

    <div class="story-list">
      <button
        v-for="(story, i) in filteredStories"
        :key="story.id"
        class="story-item"
        type="button"
        :style="{ animationDelay: `${Math.min(i, 12) * 0.04}s` }"
        @click="openDetail(story.id)"
      >
        <div class="story-item__index" aria-hidden="true">
          {{ String(i + 1).padStart(2, '0') }}
        </div>
        <div class="story-item__body">
          <div class="story-item__title">{{ story.title }}</div>
          <p class="story-item__summary">{{ story.summary }}</p>
          <div class="story-item__meta">
            <span>{{ story.tag }}</span>
            <span>{{ story.age }}</span>
            <span>约 {{ story.minutes }} 分钟</span>
          </div>
        </div>
        <span class="story-item__arrow" aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getAllTags, getFavoriteStories, gushiData, type Story } from '../config'
import TagSelect from './TagSelect.vue'

const router = useRouter()
const tags = getAllTags()
const selectedTag = ref('')
const favoritesOnly = ref(false)
const favoriteStories = ref<Story[]>([])

function refreshFavorites() {
  favoriteStories.value = getFavoriteStories()
}

onMounted(refreshFavorites)

watch(favoritesOnly, (on) => {
  if (on) refreshFavorites()
})

const filteredStories = computed(() => {
  const source = favoritesOnly.value ? favoriteStories.value : gushiData.stories
  if (!selectedTag.value) return source
  return source.filter((story) => story.tag === selectedTag.value)
})

const listTitle = computed(() => {
  if (favoritesOnly.value && selectedTag.value) return `收藏 · ${selectedTag.value}`
  if (favoritesOnly.value) return '我的收藏'
  if (selectedTag.value) return selectedTag.value
  return '全部故事'
})

function openDetail(id: number) {
  router.push({
    name: 'gushi-detail',
    params: { id: String(id) },
    query: favoritesOnly.value ? { from: 'favorites' } : undefined,
  })
}
</script>
