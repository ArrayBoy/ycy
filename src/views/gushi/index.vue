<template>
  <div class="gushi-page">
    <div class="gushi-page__glow gushi-page__glow--a" aria-hidden="true" />
    <div class="gushi-page__glow gushi-page__glow--b" aria-hidden="true" />
    <div class="gushi-page__moon" aria-hidden="true" />

    <header class="gushi-page__header">
      <button
        v-if="!isList"
        class="gushi-page__back"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <div class="gushi-page__heading">
        <h1 class="gushi-page__title">{{ headerTitle }}</h1>
        <p class="gushi-page__sub">{{ headerSub }}</p>
      </div>
      <RouterLink v-if="isList" class="gushi-page__home" to="/">返回首页</RouterLink>
      <span v-else class="gushi-page__home-spacer" aria-hidden="true" />
    </header>

    <main class="gushi-page__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { getStoryById, gushiData, parseRouteParam } from './config'
import './index.scss'

const route = useRoute()
const router = useRouter()

const isList = computed(() => route.name === 'gushi')

const currentStory = computed(() => getStoryById(parseRouteParam(route.params.id)))

const headerTitle = computed(() => {
  if (route.name === 'gushi-detail') return currentStory.value?.title || '故事详情'
  return gushiData.title
})

const headerSub = computed(() => {
  if (route.name === 'gushi-detail') {
    const story = currentStory.value
    if (!story) return ''
    return `${story.tag} · 约 ${story.minutes} 分钟`
  }
  return `${gushiData.subtitle} · 共 ${gushiData.stories.length} 个`
})

function goBack() {
  router.push({ name: 'gushi' })
}
</script>
