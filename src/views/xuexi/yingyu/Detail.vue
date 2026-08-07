<template>
  <article v-if="item" class="xuexi-detail">
    <header class="xuexi-detail__hero xuexi-detail__hero--center">
      <p class="xuexi-detail__eyebrow">{{ item.category }}</p>
      <div class="xuexi-detail__big xuexi-detail__big--word">{{ item.word }}</div>
      <h2 class="xuexi-detail__title">{{ item.phonetic }}</h2>
      <p class="xuexi-detail__sub">{{ item.meaning }} · {{ item.summary }}</p>
    </header>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">例句</div>
      <p class="xuexi-detail__text xuexi-detail__text--en">{{ item.example }}</p>
      <p class="xuexi-detail__text">{{ item.exampleZh }}</p>
    </div>
  </article>
  <div v-else class="xuexi-empty">没有找到这个单词</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { parseRouteParam } from '../config'
import { getYingyuById } from './config'

const route = useRoute()
const item = computed(() => getYingyuById(parseRouteParam(route.params.id)))
</script>
