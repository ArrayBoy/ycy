<template>
  <div class="xuexi-page" :class="{ 'is-draw': isDraw }">
    <div class="xuexi-page__glow xuexi-page__glow--a" aria-hidden="true" />
    <div class="xuexi-page__glow xuexi-page__glow--b" aria-hidden="true" />

    <header class="xuexi-page__header">
      <button
        v-if="!isHome"
        class="xuexi-page__back"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <div class="xuexi-page__heading">
        <h1 class="xuexi-page__title">{{ headerTitle }}</h1>
        <p class="xuexi-page__sub">{{ headerSub }}</p>
      </div>
      <RouterLink v-if="isHome" class="xuexi-page__home" to="/">返回首页</RouterLink>
      <span v-else class="xuexi-page__home-spacer" aria-hidden="true" />
    </header>

    <main class="xuexi-page__content" :class="{ 'xuexi-page__content--draw': isDraw }">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { getModuleByKey, pageConfig, parseRouteParam } from './config'
import { getShiciById, shiciData } from './shici/config'
import { getShuziById, shuziData } from './shuzi/config'
import { getWenziById, wenziData } from './wenzi/config'
import { getYingyuById, yingyuData } from './yingyu/config'
import './index.scss'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.name === pageConfig.name)
const isDraw = computed(() => route.name === 'xuexi-huahua')

const moduleKey = computed(() => {
  const name = String(route.name || '')
  if (name.includes('shici')) return 'shici'
  if (name.includes('shuzi')) return 'shuzi'
  if (name.includes('wenzi')) return 'wenzi'
  if (name.includes('yingyu')) return 'yingyu'
  if (name.includes('huahua')) return 'huahua'
  return ''
})

const currentModule = computed(() => getModuleByKey(moduleKey.value))

const headerTitle = computed(() => {
  if (isHome.value) return pageConfig.title
  if (route.name === 'xuexi-shici-detail') {
    return getShiciById(parseRouteParam(route.params.id))?.title || '诗词详情'
  }
  if (route.name === 'xuexi-shuzi-detail') {
    const item = getShuziById(parseRouteParam(route.params.id))
    return item ? `${item.num}` : '数字详情'
  }
  if (route.name === 'xuexi-wenzi-detail') {
    return getWenziById(parseRouteParam(route.params.id))?.char || '文字详情'
  }
  if (route.name === 'xuexi-yingyu-detail') {
    return getYingyuById(parseRouteParam(route.params.id))?.word || '英语详情'
  }
  return currentModule.value?.name || pageConfig.title
})

const headerSub = computed(() => {
  if (isHome.value) return `${pageConfig.subtitle} · 五大板块`
  if (route.name === 'xuexi-huahua') return '选颜色、选粗细，开心画一画'
  if (route.name === 'xuexi-shici') return `${shiciData.subtitle} · ${shiciData.items.length} 首`
  if (route.name === 'xuexi-shuzi') return `${shuziData.subtitle} · ${shuziData.items.length} 个`
  if (route.name === 'xuexi-wenzi') return `${wenziData.subtitle} · ${wenziData.items.length} 个`
  if (route.name === 'xuexi-yingyu') return `${yingyuData.subtitle} · ${yingyuData.items.length} 个`
  if (route.name === 'xuexi-shici-detail') {
    const item = getShiciById(parseRouteParam(route.params.id))
    return item ? `${item.dynasty} · ${item.author}` : ''
  }
  if (route.name === 'xuexi-shuzi-detail') {
    const item = getShuziById(parseRouteParam(route.params.id))
    return item ? `${item.chinese} · ${item.pinyin}` : ''
  }
  if (route.name === 'xuexi-wenzi-detail') {
    const item = getWenziById(parseRouteParam(route.params.id))
    return item ? item.pinyin : ''
  }
  if (route.name === 'xuexi-yingyu-detail') {
    const item = getYingyuById(parseRouteParam(route.params.id))
    return item ? `${item.meaning} · ${item.category}` : ''
  }
  return ''
})

function goBack() {
  if (String(route.name || '').endsWith('-detail') && currentModule.value) {
    router.push({ name: currentModule.value.listName })
    return
  }
  router.push({ name: pageConfig.name })
}
</script>
