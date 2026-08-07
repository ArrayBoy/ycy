<template>
  <div>
    <div v-if="!list.length" class="empty">暂无收藏</div>
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
          <span class="tag">{{ getDishTypeLabel(item.recipe.dishType) }}</span>
        </div>
        <div class="recipe-meta">第 {{ i + 1 }} 道</div>
      </div>
      <span class="arrow">›</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getDishTypeLabel, getFavoriteRecipes } from '../config'

const router = useRouter()
const list = ref(getFavoriteRecipes())

onMounted(() => {
  list.value = getFavoriteRecipes()
})

function openDetail(index: number) {
  router.push({
    name: 'fushi-detail',
    params: { index: String(index) },
    query: { from: 'favorites' },
  })
}
</script>
