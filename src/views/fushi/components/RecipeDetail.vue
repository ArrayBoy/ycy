<template>
  <div>
    <template v-if="recipe">
      <div class="detail-card">
        <div class="detail-name">{{ recipe.name }}</div>
        <div class="detail-tags">
          <span class="detail-cat">{{ getCategoryLabel(recipe.categoryType) }}</span>
          <span class="detail-cat">{{ getDishTypeLabel(recipe.dishType) }}</span>
        </div>
        <div class="section-title">食材</div>
        <div class="ingredients">{{ recipe.ingredients }}</div>
      </div>
      <div class="detail-card">
        <div class="section-title">步骤</div>
        <ul class="steps">
          <li v-for="(step, i) in recipe.steps" :key="i" :data-num="i + 1">
            {{ cleanStep(step) }}
          </li>
        </ul>
      </div>
      <div v-if="recipe.tips" class="detail-card">
        <div class="section-title">小贴士</div>
        <div class="tips">{{ recipe.tips }}</div>
      </div>
    </template>
    <div v-else class="empty">未找到该菜谱</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  cleanStep,
  fushiData,
  getCategoryLabel,
  getDishTypeLabel,
} from '../config'

const route = useRoute()

const recipe = computed(() => {
  const index = Number(Array.isArray(route.params.index) ? route.params.index[0] : route.params.index)
  if (!Number.isInteger(index) || index < 0) return null
  return fushiData.recipes[index] ?? null
})
</script>
