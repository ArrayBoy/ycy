<template>
  <article v-if="item" class="xuexi-detail">
    <header class="xuexi-detail__hero xuexi-detail__hero--center">
      <div class="xuexi-detail__big xuexi-detail__big--char">{{ item.char }}</div>
      <h2 class="xuexi-detail__title">{{ item.pinyin }}</h2>
      <p class="xuexi-detail__sub">{{ item.summary }}</p>
    </header>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">意思</div>
      <p class="xuexi-detail__text">{{ item.meaning }}</p>
    </div>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">组词</div>
      <div class="xuexi-detail__chips">
        <span v-for="word in item.words" :key="word">{{ word }}</span>
      </div>
    </div>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">小提示</div>
      <p class="xuexi-detail__text">{{ item.tip }}</p>
    </div>
  </article>
  <div v-else class="xuexi-empty">没有找到这个字</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { parseRouteParam } from '../config'
import { getWenziById } from './config'

const route = useRoute()
const item = computed(() => getWenziById(parseRouteParam(route.params.id)))
</script>
