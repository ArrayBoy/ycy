<template>
  <div class="flex min-h-full flex-col" :class="[bgClass, textClass]">
    <div class="flex shrink-0 items-center px-4 pt-[calc(10px+env(safe-area-inset-top))] pb-2.5">
      <BackHomeLink :accent-class="accentClass" />
    </div>
    <div
      class="flex flex-1 items-center justify-center px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-6"
    >
      <div class="w-full max-w-[320px] rounded-3xl bg-white/85 px-10 py-12 text-center shadow-xl">
        <h1 class="text-[42px] font-bold tracking-[0.08em]">{{ title }}</h1>
        <p class="mt-4 text-base opacity-85" :class="softClass">{{ desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackHomeLink from '@/components/BackHomeLink.vue'

defineProps<{
  title: string
  desc: string
  bgClass: string
  textClass: string
  softClass: string
  accentClass: string
}>()
</script>
