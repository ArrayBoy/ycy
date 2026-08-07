<template>
  <button
    v-for="key in grouped.order"
    :key="key"
    class="cat-item"
    type="button"
    @click="openGroup(key)"
  >
    <div v-if="mode === 'dishType'" class="cat-index emoji">
      {{ DISH_TYPE_ICON[Number(key)] || '🍽' }}
    </div>
    <div v-else class="cat-index">{{ categoryNumber(key) }}</div>
    <div class="cat-body">
      <div class="cat-name">{{ displayGroupName(mode, key) }}</div>
      <div class="cat-count">{{ (grouped.map[key] || []).length }} 道菜谱</div>
    </div>
    <span class="arrow">›</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DISH_TYPE_ICON,
  categoryNumber,
  displayGroupName,
  groupRecipes,
  parseFushiMode,
} from '../config'

const route = useRoute()
const router = useRouter()

const mode = computed(() => parseFushiMode(route.query.mode))

const grouped = computed(() => groupRecipes(mode.value))

function openGroup(type: string) {
  router.push({
    name: 'fushi-list',
    params: { mode: mode.value, type },
  })
}
</script>
