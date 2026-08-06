<template>
  <div class="view" :class="{ active }">
    <button
      v-for="key in order"
      :key="key"
      class="cat-item"
      type="button"
      @click="$emit('select', key)"
    >
      <div v-if="mode === 'dishType'" class="cat-index emoji">
        {{ DISH_TYPE_ICON[key] || '🍽' }}
      </div>
      <div v-else class="cat-index">{{ categoryNumber(key) }}</div>
      <div class="cat-body">
        <div class="cat-name">{{ displayGroupName(key) }}</div>
        <div class="cat-count">{{ (map[key] || []).length }} 道菜谱</div>
      </div>
      <span class="arrow">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FushiMode, Recipe } from '../config'
import { DISH_TYPE_ICON } from '../config'

defineProps<{
  active: boolean
  mode: FushiMode
  order: string[]
  map: Record<string, { recipe: Recipe; index: number }[]>
  categoryNumber: (name: string) => string
  displayGroupName: (key: string) => string
}>()

defineEmits<{
  select: [key: string]
}>()
</script>
