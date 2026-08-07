<template>
  <div>
    <div v-for="(item, i) in list" :key="item.title" class="info-card">
      <div class="info-card-meta">技巧 {{ i + 1 }}</div>
      <div class="info-card-title">{{ item.title }}</div>
      <div class="info-card-body">{{ item.content }}</div>
    </div>
    <div v-if="!list.length" class="empty">暂无技巧</div>
    <div class="home-back-bar">
      <button class="home-back-btn" type="button" @click="goHome">返回辅食列表</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { fushiData } from '../config'

const list = fushiData.tips_and_tricks
const router = useRouter()

function goHome() {
  router.push({ name: 'fushi' })
}
</script>
