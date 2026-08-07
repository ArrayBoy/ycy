<template>
  <div class="xuexi-list">
    <button
      v-for="(item, i) in shiciData.items"
      :key="item.id"
      class="xuexi-row"
      type="button"
      :style="{ animationDelay: `${Math.min(i, 10) * 0.04}s` }"
      @click="openDetail(item.id)"
    >
      <div class="xuexi-row__badge">诗</div>
      <div class="xuexi-row__body">
        <div class="xuexi-row__title">{{ item.title }}</div>
        <p class="xuexi-row__summary">{{ item.summary }}</p>
        <div class="xuexi-row__meta">
          <span>{{ item.dynasty }}</span>
          <span>{{ item.author }}</span>
        </div>
      </div>
      <span class="xuexi-row__arrow">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { shiciData } from './config'

const router = useRouter()

function openDetail(id: number) {
  router.push({ name: 'xuexi-shici-detail', params: { id: String(id) } })
}
</script>
