<template>
  <div class="mode-switch" :class="{ show }">
    <button
      class="mode-btn"
      :class="{ active: mode === 'category' }"
      type="button"
      @click="$emit('change', 'category')"
    >
      按食材大类
    </button>
    <button
      class="mode-btn"
      :class="{ active: mode === 'dishType' }"
      type="button"
      @click="$emit('change', 'dishType')"
    >
      按菜式类型
    </button>
  </div>
</template>

<script setup lang="ts">
import type { FushiMode } from '../config'

defineProps<{
  show: boolean
  mode: FushiMode
}>()

defineEmits<{
  change: [mode: FushiMode]
}>()
</script>
