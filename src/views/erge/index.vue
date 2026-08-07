<template>
  <div class="erge-page">
    <div class="erge-page__glow erge-page__glow--a" aria-hidden="true" />
    <div class="erge-page__glow erge-page__glow--b" aria-hidden="true" />
    <div class="erge-page__note" aria-hidden="true">♪</div>

    <header class="erge-page__header">
      <button
        v-if="!isList"
        class="erge-page__back"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <div class="erge-page__heading">
        <h1 class="erge-page__title">{{ headerTitle }}</h1>
        <p class="erge-page__sub">{{ headerSub }}</p>
      </div>
      <RouterLink v-if="isList" class="erge-page__home" to="/">返回首页</RouterLink>
      <span v-else class="erge-page__home-spacer" aria-hidden="true" />
    </header>

    <main class="erge-page__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ergeData, getSongById, parseRouteParam } from './config'
import './index.scss'

const route = useRoute()
const router = useRouter()

const isList = computed(() => route.name === 'erge')
const currentSong = computed(() => getSongById(parseRouteParam(route.params.id)))

const headerTitle = computed(() => {
  if (route.name === 'erge-detail') return currentSong.value?.title || '儿歌详情'
  return ergeData.title
})

const headerSub = computed(() => {
  if (route.name === 'erge-detail') {
    const song = currentSong.value
    if (!song) return ''
    return `${song.tag} · 约 ${song.minutes} 分钟`
  }
  return `${ergeData.subtitle} · 共 ${ergeData.songs.length} 首`
})

function goBack() {
  if (route.name === 'erge-detail') {
    router.push({ name: 'erge' })
    return
  }
  router.push({ name: 'erge' })
}
</script>
