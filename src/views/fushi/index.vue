<script setup lang="ts">
import { computed } from 'vue'
import { useFushi } from './config'
import FushiHeader from './components/FushiHeader.vue'
import FushiHomeTools from './components/FushiHomeTools.vue'
import FushiModeSwitch from './components/FushiModeSwitch.vue'
import FushiCategoryList from './components/FushiCategoryList.vue'
import FushiRecipeList from './components/FushiRecipeList.vue'
import FushiRecipeDetail from './components/FushiRecipeDetail.vue'
import FushiShoppingList from './components/FushiShoppingList.vue'
import FushiTipsList from './components/FushiTipsList.vue'

const {
  data,
  loading,
  error,
  view,
  mode,
  groupKey,
  recipeIndex,
  recipes,
  title,
  isHome,
  shortCategory,
  categoryNumber,
  displayGroupName,
  groupRecipes,
  setMode,
  openGroup,
  openRecipe,
  openShopping,
  openTips,
  goHome,
  goBack,
} = useFushi()

const grouped = computed(() => groupRecipes(mode.value))
const currentList = computed(() => {
  if (!groupKey.value) return []
  return grouped.value.map[groupKey.value] || []
})
const currentRecipe = computed(() => {
  if (recipeIndex.value === null) return null
  return recipes.value[recipeIndex.value] || null
})

const headerTitle = computed(() => {
  if (view.value === 'categories') return title.value
  if (view.value === 'recipes') return displayGroupName(groupKey.value || '')
  if (view.value === 'detail') return '菜谱详情'
  if (view.value === 'shopping') return '周采购清单'
  if (view.value === 'tips') return '烹饪小技巧'
  return title.value
})

const headerSub = computed(() => {
  if (view.value === 'categories') {
    return `共 ${recipes.value.length} 道 · ${mode.value === 'category' ? '按食材大类浏览' : '按菜式类型浏览'}`
  }
  if (view.value === 'recipes') return `${currentList.value.length} 道菜谱`
  if (view.value === 'detail' && currentRecipe.value) {
    return displayGroupName(groupKey.value || currentRecipe.value.category)
  }
  if (view.value === 'shopping') {
    return `共 ${data.value?.weekly_shopping_list?.length || 0} 类食材建议`
  }
  if (view.value === 'tips') {
    return `共 ${data.value?.tips_and_tricks?.length || 0} 条实用建议`
  }
  return ''
})
</script>

<template>
  <div class="fushi-page">
    <FushiHeader
      :title="headerTitle"
      :subtitle="headerSub"
      :is-home="isHome"
      @back="goBack"
    />

    <FushiHomeTools
      :show="isHome"
      @shopping="openShopping"
      @tips="openTips"
    />

    <FushiModeSwitch
      :show="isHome"
      :mode="mode"
      @change="setMode"
    />

    <main class="content">
      <div v-if="loading" class="empty">加载中…</div>
      <div v-else-if="error" class="empty">{{ error }}</div>

      <template v-else-if="data">
        <FushiCategoryList
          :active="view === 'categories'"
          :mode="mode"
          :order="grouped.order"
          :map="grouped.map"
          :category-number="categoryNumber"
          :display-group-name="displayGroupName"
          @select="openGroup"
        />

        <FushiRecipeList
          :active="view === 'recipes'"
          :mode="mode"
          :list="currentList"
          :short-category="shortCategory"
          @select="openRecipe"
        />

        <FushiRecipeDetail
          :active="view === 'detail'"
          :recipe="currentRecipe"
          :short-category="shortCategory"
        />

        <FushiShoppingList
          :active="view === 'shopping'"
          :list="data.weekly_shopping_list"
          @home="goHome"
        />

        <FushiTipsList
          :active="view === 'tips'"
          :list="data.tips_and_tricks"
          @home="goHome"
        />
      </template>
    </main>
  </div>
</template>

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
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
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

  .view {
    display: none;

    &.active {
      display: block;
    }
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

  .detail-name {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.35;
    margin-bottom: 8px;
  }

  .detail-tags {
    margin-bottom: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .detail-cat {
    display: inline-block;
    font-size: 12px;
    color: $accent;
    background: $accent-soft;
    padding: 4px 10px;
    border-radius: 999px;
  }

  .section-title {
    font-size: 14px;
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
    font-size: 14px;
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
      font-size: 14px;
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
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .tips {
    font-size: 14px;
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

  .home-tools {
    flex-shrink: 0;
    display: none;
    padding: 10px 16px 0;
    gap: 8px;

    &.show {
      display: flex;
    }
  }

  .tool-btn {
    flex: 1;
    border: 1px solid $line;
    background: $surface;
    color: $text;
    font-size: 12px;
    font-weight: 600;
    padding: 8px 6px;
    border-radius: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(59, 36, 21, 0.04);

    &:active {
      transform: scale(0.98);
    }

    span.icon {
      font-size: 14px;
      line-height: 1;
    }
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
