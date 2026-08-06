<template>
  <div class="home-tools" :class="{ show }">
    <button class="tool-btn" type="button" @click="$emit('shopping')">
      <span class="icon">🛒</span>
      周采购清单
    </button>
    <button class="tool-btn" type="button" @click="$emit('tips')">
      <span class="icon">💡</span>
      烹饪小技巧
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  shopping: []
  tips: []
}>()
</script>
