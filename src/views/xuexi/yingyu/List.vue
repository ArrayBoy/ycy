<template>
  <div class="xuexi-list">
    <button
      v-for="(item, i) in yingyuData.items"
      :key="item.id"
      class="xuexi-row"
      type="button"
      :style="{ animationDelay: `${Math.min(i, 10) * 0.04}s` }"
      @click="openDetail(item.id)"
    >
      <div class="xuexi-row__badge xuexi-row__badge--en">{{ item.word.slice(0, 1) }}</div>
      <div class="xuexi-row__body">
        <div class="xuexi-row__title">{{ item.word }}</div>
        <p class="xuexi-row__summary">{{ item.meaning }} · {{ item.summary }}</p>
        <div class="xuexi-row__meta">
          <span>{{ item.category }}</span>
          <span>{{ item.phonetic }}</span>
        </div>
      </div>
      <span class="xuexi-row__arrow">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { yingyuData } from './config'

const router = useRouter()

function openDetail(id: number) {
  router.push({ name: 'xuexi-yingyu-detail', params: { id: String(id) } })
}
</script>
