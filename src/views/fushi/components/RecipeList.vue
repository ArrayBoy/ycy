<template>
  <div>
    <div v-if="!list.length" class="empty">暂无菜谱</div>
    <button
      v-for="(item, i) in list"
      :key="item.index"
      class="recipe-item"
      type="button"
      @click="openDetail(item.index)"
    >
      <div class="recipe-dot"></div>
      <div class="recipe-body">
        <div class="recipe-name">
          {{ item.recipe.name }}
          <span v-if="mode === 'dishType'" class="tag">
            {{ getCategoryLabel(item.recipe.categoryType) }}
          </span>
          <span v-else class="tag">{{ getDishTypeLabel(item.recipe.dishType) }}</span>
        </div>
        <div class="recipe-meta">第 {{ i + 1 }} 道</div>
      </div>
      <span class="arrow">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  getCategoryLabel,
  getDishTypeLabel,
  getRecipesByGroup,
  parseFushiMode,
  parseRouteParam,
} from '../config'

const route = useRoute()
const router = useRouter()

const mode = computed(() => parseFushiMode(route.params.mode))
const type = computed(() => parseRouteParam(route.params.type))
const list = computed(() => getRecipesByGroup(mode.value, type.value))

function openDetail(index: number) {
  router.push({
    name: 'fushi-detail',
    params: { index: String(index) },
    query: { mode: mode.value, type: type.value },
  })
}
</script>
