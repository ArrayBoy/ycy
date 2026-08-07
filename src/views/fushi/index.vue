<template>
  <div class="fushi-page">
    <header class="header">
      <button
        class="back-btn"
        :class="{ show: !isHome }"
        type="button"
        aria-label="返回"
        @click="goBack"
      >
        ‹
      </button>
      <div class="header-text">
        <div class="header-title">{{ headerTitle }}</div>
        <div class="header-sub">{{ headerSub }}</div>
      </div>
      <div class="header-actions">
        <div ref="helpWrapRef" class="help-wrap">
          <button
            class="help-btn"
            type="button"
            aria-label="帮助"
            aria-haspopup="menu"
            :aria-expanded="menuOpen"
            @click="toggleMenu"
          >
            ?
          </button>
          <div v-show="menuOpen" class="help-menu" role="menu">
            <button class="help-item" type="button" role="menuitem" @click="goShopping">
              周采购清单
            </button>
            <button class="help-item" type="button" role="menuitem" @click="goTips">
              烹饪小技巧
            </button>
            <button class="help-item" type="button" role="menuitem" @click="goFavorites">
              我的收藏
            </button>
          </div>
        </div>
        <RouterLink class="site-home-link" :class="{ show: isHome }" to="/">返回首页</RouterLink>
      </div>
    </header>

    <div v-if="isHome" class="mode-switch show">
      <button
        class="mode-btn"
        :class="{ active: mode === 'category' }"
        type="button"
        @click="setMode('category')"
      >
        按食材大类
      </button>
      <button
        class="mode-btn"
        :class="{ active: mode === 'dishType' }"
        type="button"
        @click="setMode('dishType')"
      >
        按菜式类型
      </button>
    </div>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  displayGroupName,
  fushiData,
  getFavoriteRecipes,
  getRecipesByGroup,
  isFushiMode,
  parseFushiMode,
  parseRouteParam,
  type FushiMode,
} from './config'

const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const helpWrapRef = ref<HTMLElement | null>(null)

const isHome = computed(() => route.name === 'fushi')

const mode = computed<FushiMode>(() => {
  if (route.params.mode != null && route.params.mode !== '') {
    return parseFushiMode(route.params.mode)
  }
  return parseFushiMode(route.query.mode)
})

const groupType = computed(() => {
  const fromParams = parseRouteParam(route.params.type)
  if (fromParams) return fromParams
  return parseRouteParam(route.query.type)
})

const currentList = computed(() => {
  if (!groupType.value) return []
  return getRecipesByGroup(mode.value, groupType.value)
})

const currentRecipe = computed(() => {
  const index = Number(parseRouteParam(route.params.index))
  if (!Number.isInteger(index) || index < 0) return null
  return fushiData.recipes[index] ?? null
})

const headerTitle = computed(() => {
  if (route.name === 'fushi') return fushiData.title
  if (route.name === 'fushi-list') return displayGroupName(mode.value, groupType.value)
  if (route.name === 'fushi-detail') return '菜谱详情'
  if (route.name === 'fushi-shopping') return '周采购清单'
  if (route.name === 'fushi-tips') return '烹饪小技巧'
  if (route.name === 'fushi-favorites') return '我的收藏'
  return fushiData.title
})

const headerSub = computed(() => {
  if (route.name === 'fushi') {
    return `共 ${fushiData.recipes.length} 道 · ${mode.value === 'category' ? '按食材大类浏览' : '按菜式类型浏览'}`
  }
  if (route.name === 'fushi-list') return `${currentList.value.length} 道菜谱`
  if (route.name === 'fushi-detail' && currentRecipe.value) {
    return displayGroupName(
      mode.value,
      groupType.value ||
        (mode.value === 'dishType'
          ? currentRecipe.value.dishType
          : currentRecipe.value.categoryType),
    )
  }
  if (route.name === 'fushi-shopping') {
    return `共 ${fushiData.weekly_shopping_list.length} 类食材建议`
  }
  if (route.name === 'fushi-tips') {
    return `共 ${fushiData.tips_and_tricks.length} 条实用建议`
  }
  if (route.name === 'fushi-favorites') {
    return `共 ${getFavoriteRecipes().length} 道收藏`
  }
  return ''
})

function setMode(next: FushiMode) {
  router.replace({
    name: 'fushi',
    query: next === 'category' ? {} : { mode: next },
  })
}

function goBack() {
  if (route.name === 'fushi-detail') {
    if (route.query.from === 'favorites') {
      router.push({ name: 'fushi-favorites' })
      return
    }
    if (isFushiMode(route.query.mode) && route.query.type != null) {
      router.push({
        name: 'fushi-list',
        params: { mode: route.query.mode, type: String(route.query.type) },
      })
      return
    }
  }
  if (route.name === 'fushi-list') {
    router.push({
      name: 'fushi',
      query: mode.value === 'category' ? {} : { mode: mode.value },
    })
    return
  }
  if (
    route.name === 'fushi-shopping' ||
    route.name === 'fushi-tips' ||
    route.name === 'fushi-favorites'
  ) {
    router.push({ name: 'fushi' })
    return
  }
  router.push({ name: 'fushi' })
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function goShopping() {
  closeMenu()
  router.push({ name: 'fushi-shopping' })
}

function goTips() {
  closeMenu()
  router.push({ name: 'fushi-tips' })
}

function goFavorites() {
  closeMenu()
  router.push({ name: 'fushi-favorites' })
}

function onDocPointerDown(e: Event) {
  const el = helpWrapRef.value
  if (!el || !menuOpen.value) return
  if (!el.contains(e.target as Node)) closeMenu()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
})
</script>

<style lang="scss">
$bg: #fff8f1;
$surface: #ffffff;
$text: #3b2415;
$muted: #8a6a52;
$accent: #e8792f;
$accent-soft: #fff1e6;
$line: #f0e0d0;

.fushi-page {
  --bg: #{$bg};
  --surface: #{$surface};
  --text: #{$text};
  --muted: #{$muted};
  --accent: #{$accent};
  --accent-soft: #{$accent-soft};
  --line: #{$line};
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);

  height: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  font-family:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
    sans-serif;
  background: $bg;
  color: $text;
  line-height: 1.55;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 0 40px rgba(59, 36, 21, 0.06);

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .header {
    flex-shrink: 0;
    padding: calc(12px + var(--safe-top)) 16px 12px;
    background: linear-gradient(180deg, #ffe8d2 0%, $bg 100%);
    border-bottom: 1px solid $line;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 56px;
  }

  .back-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    font-size: 20px;
    line-height: 1;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(232, 121, 47, 0.15);
    cursor: pointer;
    flex-shrink: 0;

    &.show {
      display: flex;
    }
  }

  .site-home-link {
    flex-shrink: 0;
    display: none;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 12px;
    border-radius: 18px;
    background: $surface;
    color: $accent;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    box-shadow: 0 2px 8px rgba(232, 121, 47, 0.15);
    white-space: nowrap;

    &.show {
      display: inline-flex;
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .header-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .help-wrap {
    position: relative;
  }

  .help-btn {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: $surface;
    color: $accent;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(232, 121, 47, 0.15);
    cursor: pointer;

    &:active {
      transform: scale(0.96);
    }
  }

  .help-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 148px;
    padding: 6px;
    border-radius: 12px;
    background: $surface;
    border: 1px solid $line;
    box-shadow: 0 10px 28px rgba(59, 36, 21, 0.12);
    z-index: 20;
  }

  .help-item {
    width: 100%;
    border: none;
    background: transparent;
    color: $text;
    font-size: 13px;
    font-weight: 600;
    text-align: left;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;

    &:hover,
    &:active {
      background: $accent-soft;
      color: $accent;
    }
  }

  .header-text {
    min-width: 0;
    flex: 1;
  }

  .header-title {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-sub {
    font-size: 12px;
    color: $muted;
    margin-top: 2px;
  }

  .mode-switch {
    flex-shrink: 0;
    display: none;
    padding: 10px 16px 0;
    gap: 8px;

    &.show {
      display: flex;
    }
  }

  .mode-btn {
    flex: 1;
    border: 1px solid $line;
    background: $surface;
    color: $muted;
    font-size: 13px;
    font-weight: 600;
    padding: 10px 8px;
    border-radius: 999px;
    cursor: pointer;

    &.active {
      background: $accent;
      border-color: $accent;
      color: #fff;
      box-shadow: 0 4px 12px rgba(232, 121, 47, 0.28);
    }
  }

  .content {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 12px 16px calc(20px + var(--safe-bottom));
  }

  .cat-item,
  .recipe-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    text-align: left;
    border: none;
    background: $surface;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px rgba(59, 36, 21, 0.04);
    cursor: pointer;
    transition: transform 0.15s ease;

    &:active {
      transform: scale(0.98);
    }
  }

  .cat-index {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: $accent-soft;
    color: $accent;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.emoji {
      font-size: 18px;
    }
  }

  .cat-body,
  .recipe-body {
    flex: 1;
    min-width: 0;
  }

  .cat-name,
  .recipe-name {
    font-size: 15px;
    font-weight: 600;
    color: $text;
  }

  .cat-count,
  .recipe-meta {
    font-size: 12px;
    color: $muted;
    margin-top: 4px;
  }

  .arrow {
    color: #d4b8a0;
    font-size: 18px;
    flex-shrink: 0;
  }

  .recipe-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: $accent;
    opacity: 0.55;
    flex-shrink: 0;
  }

  .tag {
    display: inline-block;
    font-size: 11px;
    color: $accent;
    background: $accent-soft;
    padding: 2px 8px;
    border-radius: 999px;
    margin-left: 6px;
    vertical-align: middle;
    font-weight: 600;
  }

  .detail-card {
    background: $surface;
    border-radius: 16px;
    padding: 18px 16px;
    box-shadow: 0 2px 12px rgba(59, 36, 21, 0.05);
    margin-bottom: 12px;
  }

  .recipe-detail {
    --detail-fs: 14px;
  }

  .font-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  .font-btn {
    border: 1px solid $line;
    background: $surface;
    color: $text;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(59, 36, 21, 0.04);

    &:active:not(:disabled) {
      transform: scale(0.97);
    }

    &:disabled {
      opacity: 0.45;
      cursor: default;
    }
  }

  .font-size-hint {
    margin-left: auto;
    font-size: 12px;
    color: $muted;
    font-weight: 600;
  }

  .detail-name-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 8px;
  }

  .detail-name {
    flex: 1;
    min-width: 0;
    font-size: calc(var(--detail-fs) + 6px);
    font-weight: 700;
    line-height: 1.35;
  }

  .fav-btn {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    margin-top: 2px;
    border: none;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linejoin: round;
    }

    &.active {
      background: $accent;
      color: #fff;

      svg {
        fill: currentColor;
        stroke: currentColor;
      }
    }

    &:active {
      transform: scale(0.94);
    }
  }

  .fushi-toast {
    position: fixed;
    left: 50%;
    bottom: calc(28px + var(--safe-bottom));
    transform: translateX(-50%);
    z-index: 50;
    max-width: calc(100% - 48px);
    padding: 10px 16px;
    border-radius: 999px;
    background: rgba(59, 36, 21, 0.88);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 8px 20px rgba(59, 36, 21, 0.18);
  }

  .detail-tags {
    margin-bottom: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .detail-cat {
    display: inline-block;
    font-size: calc(var(--detail-fs) - 2px);
    color: $accent;
    background: $accent-soft;
    padding: 4px 10px;
    border-radius: 999px;
  }

  .section-title {
    font-size: var(--detail-fs);
    font-weight: 700;
    color: $accent;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: '';
      width: 4px;
      height: 14px;
      border-radius: 2px;
      background: $accent;
    }
  }

  .ingredients {
    font-size: var(--detail-fs);
    color: $text;
    background: $bg;
    border-radius: 12px;
    padding: 12px;
    line-height: 1.7;
  }

  .steps {
    list-style: none;

    li {
      position: relative;
      padding: 10px 10px 10px 42px;
      font-size: var(--detail-fs);
      border-bottom: 1px dashed $line;

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: attr(data-num);
        position: absolute;
        left: 0;
        top: 10px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: $accent-soft;
        color: $accent;
        font-size: calc(var(--detail-fs) - 2px);
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .tips {
    font-size: var(--detail-fs);
    color: #8a5a2b;
    background: #fff6e8;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid #ffe2bd;
    line-height: 1.7;
  }

  .empty {
    text-align: center;
    color: $muted;
    padding: 40px 16px;
    font-size: 14px;
  }

  .info-card {
    background: $surface;
    border-radius: 14px;
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px rgba(59, 36, 21, 0.04);
  }

  .info-card-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
    color: $text;
  }

  .info-card-meta {
    font-size: 12px;
    color: $accent;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .info-card-body {
    font-size: 14px;
    color: $muted;
    line-height: 1.7;
  }

  .home-back-bar {
    margin-top: 8px;
    padding-top: 4px;
  }

  .home-back-btn {
    width: 100%;
    border: none;
    background: $accent;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    padding: 14px;
    border-radius: 14px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(232, 121, 47, 0.28);

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
