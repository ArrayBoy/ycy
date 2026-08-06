<template>
  <header class="header">
    <button
      class="back-btn"
      :class="{ show: !isHome }"
      type="button"
      aria-label="返回"
      @click="$emit('back')"
    >
      ‹
    </button>
    <div class="header-text">
      <div class="header-title">{{ title }}</div>
      <div class="header-sub">{{ subtitle }}</div>
    </div>
    <RouterLink class="site-home-link" :class="{ show: isHome }" to="/">返回首页</RouterLink>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  title: string
  subtitle: string
  isHome: boolean
}>()

defineEmits<{
  back: []
}>()
</script>
