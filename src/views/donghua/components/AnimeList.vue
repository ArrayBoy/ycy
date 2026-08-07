<template>
  <div class="anime-list-page">
    <div class="anime-toolbar">
      <TagSelect v-model="selectedTag" :options="tags" />
      <button
        class="anime-fav-toggle"
        type="button"
        :class="{ active: favoritesOnly }"
        @click="favoritesOnly = !favoritesOnly"
      >
        {{ favoritesOnly ? '全部动画' : '我的收藏' }}
      </button>
    </div>

    <p class="anime-list-count">{{ listTitle }} · {{ filteredItems.length }} 部</p>

    <div v-if="!filteredItems.length" class="anime-empty">
      {{ favoritesOnly ? '还没有收藏动画' : '没有符合筛选的动画' }}
    </div>

    <div class="anime-list">
      <button
        v-for="(item, i) in filteredItems"
        :key="item.id"
        class="anime-item"
        type="button"
        :style="{ animationDelay: `${Math.min(i, 12) * 0.04}s` }"
        @click="openDetail(item.id)"
      >
        <div class="anime-item__thumb" aria-hidden="true">
          <span class="anime-item__play">▶</span>
        </div>
        <div class="anime-item__body">
          <div class="anime-item__title">{{ item.title }}</div>
          <p class="anime-item__summary">{{ item.summary }}</p>
          <div class="anime-item__meta">
            <span>{{ item.tag }}</span>
            <span>{{ item.age }}</span>
            <span>约 {{ item.minutes }} 分钟</span>
          </div>
        </div>
        <span class="anime-item__arrow" aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { donghuaData, getAllTags, getFavoriteAnimes, type AnimeItem } from '../config'
import TagSelect from './TagSelect.vue'

const router = useRouter()
const tags = getAllTags()
const selectedTag = ref('')
const favoritesOnly = ref(false)
const favoriteItems = ref<AnimeItem[]>([])

function refreshFavorites() {
  favoriteItems.value = getFavoriteAnimes()
}

onMounted(refreshFavorites)

watch(favoritesOnly, (on) => {
  if (on) refreshFavorites()
})

const filteredItems = computed(() => {
  const source = favoritesOnly.value ? favoriteItems.value : donghuaData.items
  if (!selectedTag.value) return source
  return source.filter((item) => item.tag === selectedTag.value)
})

const listTitle = computed(() => {
  if (favoritesOnly.value && selectedTag.value) return `收藏 · ${selectedTag.value}`
  if (favoritesOnly.value) return '我的收藏'
  if (selectedTag.value) return selectedTag.value
  return '全部动画'
})

function openDetail(id: number) {
  router.push({
    name: 'donghua-detail',
    params: { id: String(id) },
    query: favoritesOnly.value ? { from: 'favorites' } : undefined,
  })
}
</script>
