<template>
  <article v-if="item" class="xuexi-detail">
    <header class="xuexi-detail__hero">
      <p class="xuexi-detail__eyebrow">{{ item.dynasty }} · {{ item.author }}</p>
      <h2 class="xuexi-detail__title">{{ item.title }}</h2>
    </header>
    <div class="xuexi-detail__card xuexi-detail__poem">
      <p v-for="(line, i) in item.lines" :key="i" class="xuexi-detail__line">{{ line }}</p>
    </div>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">小提示</div>
      <p class="xuexi-detail__text">{{ item.note }}</p>
    </div>
  </article>
  <div v-else class="xuexi-empty">没有找到这首诗</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { parseRouteParam } from '../config'
import { getShiciById } from './config'

const route = useRoute()
const item = computed(() => getShiciById(parseRouteParam(route.params.id)))
</script>
