<template>
  <div class="xuexi-list xuexi-list--grid">
    <button
      v-for="(item, i) in shuziData.items"
      :key="item.id"
      class="xuexi-num"
      type="button"
      :style="{ animationDelay: `${Math.min(i, 10) * 0.04}s` }"
      @click="openDetail(item.id)"
    >
      <span class="xuexi-num__digit">{{ item.num }}</span>
      <span class="xuexi-num__cn">{{ item.chinese }}</span>
      <span class="xuexi-num__py">{{ item.pinyin }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { shuziData } from './config'

const router = useRouter()

function openDetail(id: number) {
  router.push({ name: 'xuexi-shuzi-detail', params: { id: String(id) } })
}
</script>
