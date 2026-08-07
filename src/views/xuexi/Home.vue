<template>
  <div class="xuexi-hub">
    <p class="xuexi-hub__intro">选一个小课堂，开始今天的启蒙吧</p>
    <div class="xuexi-hub__grid">
      <button
        v-for="(mod, i) in modules"
        :key="mod.key"
        class="xuexi-hub__tile"
        type="button"
        :style="{
          animationDelay: `${0.05 + i * 0.06}s`,
          '--tile-from': mod.accentFrom,
          '--tile-to': mod.accentTo,
        }"
        @click="openModule(mod)"
      >
        <span class="xuexi-hub__mark" aria-hidden="true">{{ mod.mark }}</span>
        <span class="xuexi-hub__name">{{ mod.name }}</span>
        <span class="xuexi-hub__hint">{{ mod.hint }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { modules, type XuexiModuleMeta } from './config'

const router = useRouter()

function openModule(mod: XuexiModuleMeta) {
  router.push({ name: mod.listName })
}
</script>
