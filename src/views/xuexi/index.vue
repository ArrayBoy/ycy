<script setup lang="ts">
import PlaceholderPage from '@/components/PlaceholderPage.vue'
import { pageConfig } from './config'
</script>

<template>
  <PlaceholderPage
    :title="pageConfig.title"
    :desc="pageConfig.desc"
    :bg-class="pageConfig.bgClass"
    :text-class="pageConfig.textClass"
    :soft-class="pageConfig.softClass"
    :accent-class="pageConfig.accentClass"
  />
</template>
