<template>
  <div class="song-list-page">
    <div class="song-toolbar">
      <TagSelect v-model="selectedTag" :options="tags" />
      <button
        class="song-fav-toggle"
        type="button"
        :class="{ active: favoritesOnly }"
        @click="favoritesOnly = !favoritesOnly"
      >
        {{ favoritesOnly ? '全部儿歌' : '我的收藏' }}
      </button>
    </div>

    <p class="song-list-count">{{ listTitle }} · {{ filteredSongs.length }} 首</p>

    <div v-if="!filteredSongs.length" class="song-empty">
      {{ favoritesOnly ? '还没有收藏儿歌' : '没有符合筛选的儿歌' }}
    </div>

    <div class="song-list">
      <button
        v-for="(song, i) in filteredSongs"
        :key="song.id"
        class="song-item"
        type="button"
        :style="{ animationDelay: `${Math.min(i, 12) * 0.04}s` }"
        @click="openDetail(song.id)"
      >
        <div class="song-item__note" aria-hidden="true">
          <span>{{ String(i + 1).padStart(2, '0') }}</span>
        </div>
        <div class="song-item__body">
          <div class="song-item__title">{{ song.title }}</div>
          <p class="song-item__summary">{{ song.summary }}</p>
          <div class="song-item__meta">
            <span>{{ song.tag }}</span>
            <span>{{ song.age }}</span>
            <span>约 {{ song.minutes }} 分钟</span>
          </div>
        </div>
        <span class="song-item__arrow" aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ergeData, getAllTags, getFavoriteSongs, type Song } from '../config'
import TagSelect from './TagSelect.vue'

const router = useRouter()
const tags = getAllTags()
const selectedTag = ref('')
const favoritesOnly = ref(false)
const favoriteSongs = ref<Song[]>([])

function refreshFavorites() {
  favoriteSongs.value = getFavoriteSongs()
}

onMounted(refreshFavorites)

watch(favoritesOnly, (on) => {
  if (on) refreshFavorites()
})

const filteredSongs = computed(() => {
  const source = favoritesOnly.value ? favoriteSongs.value : ergeData.songs
  if (!selectedTag.value) return source
  return source.filter((song) => song.tag === selectedTag.value)
})

const listTitle = computed(() => {
  if (favoritesOnly.value && selectedTag.value) return `收藏 · ${selectedTag.value}`
  if (favoritesOnly.value) return '我的收藏'
  if (selectedTag.value) return selectedTag.value
  return '全部儿歌'
})

function openDetail(id: number) {
  router.push({
    name: 'erge-detail',
    params: { id: String(id) },
    query: favoritesOnly.value ? { from: 'favorites' } : undefined,
  })
}
</script>
