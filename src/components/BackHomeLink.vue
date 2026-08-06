<template>
  <RouterLink
    to="/"
    class="inline-flex items-center rounded-full bg-white/90 px-4 py-2.5 text-[15px] font-semibold shadow-md active:scale-[0.97]"
    :class="accentClass"
  >
    ‹ 返回首页
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

withDefaults(
  defineProps<{
    accentClass?: string
  }>(),
  {
    accentClass: 'text-amber-700',
  },
)
</script>
