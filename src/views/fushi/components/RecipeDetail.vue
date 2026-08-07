<template>
  <div class="recipe-detail" :style="{ '--detail-fs': `${fontSize}px` }">
    <template v-if="recipe">
      <div class="font-toolbar">
        <button class="font-btn" type="button" @click="enlargeFont">放大字体</button>
        <button class="font-btn" type="button" :disabled="isDefaultFont" @click="resetFont">
          还原默认
        </button>
        <span class="font-size-hint">{{ fontSize }}px</span>
      </div>

      <div class="detail-card">
        <div class="detail-name-row">
          <div class="detail-name">{{ recipe.name }}</div>
          <button
            class="fav-btn"
            type="button"
            :class="{ active: favorited }"
            :aria-label="favorited ? '取消收藏' : '收藏'"
            @click="onToggleFavorite"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 17.3l-5.4 3.2 1.4-6.1L3.5 9.9l6.2-.5L12 3.5l2.3 5.9 6.2.5-4.5 4.5 1.4 6.1z"
              />
            </svg>
          </button>
        </div>
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
    <div v-if="toastVisible" class="fushi-toast">{{ toastText }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  DETAIL_FONT_DEFAULT,
  DETAIL_FONT_MAX,
  cleanStep,
  fushiData,
  getCategoryLabel,
  getDishTypeLabel,
  isFavorite,
  readDetailFontSize,
  saveDetailFontSize,
  toggleFavorite,
} from '../config'

const route = useRoute()
const fontSize = ref(readDetailFontSize())
const favorited = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const isDefaultFont = computed(() => fontSize.value === DETAIL_FONT_DEFAULT)

const recipeIndex = computed(() => {
  const index = Number(
    Array.isArray(route.params.index) ? route.params.index[0] : route.params.index,
  )
  return Number.isInteger(index) && index >= 0 ? index : null
})

const recipe = computed(() => {
  if (recipeIndex.value === null) return null
  return fushiData.recipes[recipeIndex.value] ?? null
})

watch(
  recipeIndex,
  (index) => {
    favorited.value = index !== null && isFavorite(index)
  },
  { immediate: true },
)

function enlargeFont() {
  if (fontSize.value >= DETAIL_FONT_MAX) return
  fontSize.value += 1
  saveDetailFontSize(fontSize.value)
}

function resetFont() {
  fontSize.value = DETAIL_FONT_DEFAULT
  saveDetailFontSize(fontSize.value)
}

function showToast(text: string) {
  toastText.value = text
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 1600)
}

function onToggleFavorite() {
  if (recipeIndex.value === null) return
  favorited.value = toggleFavorite(recipeIndex.value)
  showToast(favorited.value ? '收藏成功' : '取消收藏成功')
}

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
