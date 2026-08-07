<template>
  <div>
    <div v-for="item in list" :key="item.category" class="info-card">
      <div class="info-card-title">{{ item.category }}</div>
      <div class="info-card-body">{{ item.ingredients }}</div>
      <div class="info-card-meta" style="margin-top: 8px; margin-bottom: 0">
        建议量：{{ item.suggested_weekly_amount }}
      </div>
    </div>
    <div v-if="!list.length" class="empty">暂无清单</div>
    <div class="home-back-bar">
      <button class="home-back-btn" type="button" @click="goHome">返回辅食列表</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { fushiData } from '../config'

const list = fushiData.weekly_shopping_list
const router = useRouter()

function goHome() {
  router.push({ name: 'fushi' })
}
</script>
