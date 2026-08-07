<template>
  <article v-if="item" class="xuexi-detail">
    <header class="xuexi-detail__hero xuexi-detail__hero--center">
      <div class="xuexi-detail__big">{{ item.num }}</div>
      <h2 class="xuexi-detail__title">{{ item.chinese }} · {{ item.pinyin }}</h2>
      <p class="xuexi-detail__sub">{{ item.summary }}</p>
    </header>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">怎么记</div>
      <p class="xuexi-detail__text">{{ item.tip }}</p>
    </div>
    <div class="xuexi-detail__card">
      <div class="xuexi-detail__label">举例子</div>
      <div class="xuexi-detail__chips">
        <span v-for="ex in item.examples" :key="ex">{{ ex }}</span>
      </div>
    </div>
  </article>
  <div v-else class="xuexi-empty">没有找到这个数字</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { parseRouteParam } from '../config'
import { getShuziById } from './config'

const route = useRoute()
const item = computed(() => getShuziById(parseRouteParam(route.params.id)))
</script>
