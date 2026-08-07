<template>
  <div class="donghua-page">
    <div class="donghua-page__glow donghua-page__glow--a" aria-hidden="true" />
    <div class="donghua-page__glow donghua-page__glow--b" aria-hidden="true" />
    <div class="donghua-page__reel" aria-hidden="true" />

    <header class="donghua-page__header">
      <button
        v-if="!isList"
        class="donghua-page__back"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <div class="donghua-page__heading">
        <h1 class="donghua-page__title">{{ headerTitle }}</h1>
        <p class="donghua-page__sub">{{ headerSub }}</p>
      </div>
      <RouterLink v-if="isList" class="donghua-page__home" to="/">返回首页</RouterLink>
      <span v-else class="donghua-page__home-spacer" aria-hidden="true" />
    </header>

    <main class="donghua-page__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { donghuaData, getAnimeById, parseRouteParam } from './config'
import './index.scss'

const route = useRoute()
const router = useRouter()

const isList = computed(() => route.name === 'donghua')
const currentItem = computed(() => getAnimeById(parseRouteParam(route.params.id)))

const headerTitle = computed(() => {
  if (route.name === 'donghua-detail') return currentItem.value?.title || '动画详情'
  return donghuaData.title
})

const headerSub = computed(() => {
  if (route.name === 'donghua-detail') {
    const item = currentItem.value
    if (!item) return ''
    return `${item.tag} · 约 ${item.minutes} 分钟`
  }
  return `${donghuaData.subtitle} · 共 ${donghuaData.items.length} 部`
})

function goBack() {
  router.push({ name: 'donghua' })
}
</script>
