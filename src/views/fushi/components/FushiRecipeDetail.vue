<template>
  <div class="view" :class="{ active }">
    <template v-if="recipe">
      <div class="detail-card">
        <div class="detail-name">{{ recipe.name }}</div>
        <div class="detail-tags">
          <span class="detail-cat">{{ shortCategory(recipe.category) }}</span>
          <span class="detail-cat">{{ recipe.dishType || '' }}</span>
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
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '../config'

defineProps<{
  active: boolean
  recipe: Recipe | null
  shortCategory: (name: string) => string
}>()

function cleanStep(step: string) {
  return String(step).replace(/^\d+[\.、]\s*/, '')
}
</script>
