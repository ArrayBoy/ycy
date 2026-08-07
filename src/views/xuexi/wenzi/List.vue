<template>
  <div class="xuexi-list xuexi-list--grid">
    <button
      v-for="(item, i) in wenziData.items"
      :key="item.id"
      class="xuexi-char"
      type="button"
      :style="{ animationDelay: `${Math.min(i, 10) * 0.04}s` }"
      @click="openDetail(item.id)"
    >
      <span class="xuexi-char__glyph">{{ item.char }}</span>
      <span class="xuexi-char__py">{{ item.pinyin }}</span>
      <span class="xuexi-char__sum">{{ item.summary }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { wenziData } from './config'

const router = useRouter()

function openDetail(id: number) {
  router.push({ name: 'xuexi-wenzi-detail', params: { id: String(id) } })
}
</script>
