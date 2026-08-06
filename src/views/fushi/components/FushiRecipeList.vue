<script setup lang="ts">
import type { FushiMode, Recipe } from '../config'

defineProps<{
  active: boolean
  mode: FushiMode
  list: { recipe: Recipe; index: number }[]
  shortCategory: (name: string) => string
}>()

defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="view" :class="{ active }">
    <div v-if="!list.length" class="empty">暂无菜谱</div>
    <button
      v-for="(item, i) in list"
      :key="item.index"
      class="recipe-item"
      type="button"
      @click="$emit('select', item.index)"
    >
      <div class="recipe-dot"></div>
      <div class="recipe-body">
        <div class="recipe-name">
          {{ item.recipe.name }}
          <span v-if="mode === 'dishType'" class="tag">
            {{ shortCategory(item.recipe.category) }}
          </span>
          <span v-else-if="item.recipe.dishType" class="tag">{{ item.recipe.dishType }}</span>
        </div>
        <div class="recipe-meta">第 {{ i + 1 }} 道</div>
      </div>
      <span class="arrow">›</span>
    </button>
  </div>
</template>
