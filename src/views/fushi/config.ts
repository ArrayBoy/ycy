import { computed, ref } from 'vue'
import fushiJson from './fushi.json'

export const pageConfig = {
  name: 'fushi',
  title: '辅食',
  path: '/fushi',
} as const

export interface Recipe {
  category: string
  dishType: string
  name: string
  ingredients: string
  steps: string[]
  tips?: string
}

export interface ShoppingItem {
  category: string
  ingredients: string
  suggested_weekly_amount: string
}

export interface TipItem {
  title: string
  content: string
}

export interface FushiData {
  title: string
  recipes: Recipe[]
  weekly_shopping_list: ShoppingItem[]
  tips_and_tricks: TipItem[]
}

export type FushiViewName = 'categories' | 'recipes' | 'detail' | 'shopping' | 'tips'
export type FushiMode = 'category' | 'dishType'

const DISH_TYPE_ORDER = ['米饭', '面类', '汤粥', '饼', '蒸糕', '手指食物'] as const

export const DISH_TYPE_ICON: Record<string, string> = {
  米饭: '🍚',
  面类: '🍜',
  汤粥: '🥣',
  饼: '🥞',
  蒸糕: '🧁',
  手指食物: '✋',
}

export function useFushi() {
  const data = ref<FushiData | null>(fushiJson as FushiData)
  const loading = ref(false)
  const error = ref('')
  const view = ref<FushiViewName>('categories')
  const mode = ref<FushiMode>('category')
  const groupKey = ref<string | null>(null)
  const recipeIndex = ref<number | null>(null)

  const recipes = computed(() => data.value?.recipes ?? [])
  const title = computed(() => data.value?.title ?? pageConfig.title)
  const isHome = computed(() => view.value === 'categories')

  function shortCategory(name: string) {
    return String(name).replace(/^[一二三四五六七八九十]+、/, '')
  }

  function categoryNumber(name: string) {
    const m = String(name).match(/^([一二三四五六七八九十]+)、/)
    return m ? m[1] : '·'
  }

  function displayGroupName(key: string) {
    if (mode.value === 'dishType') return key
    return shortCategory(key)
  }

  function groupRecipes(currentMode: FushiMode) {
    const map: Record<string, { recipe: Recipe; index: number }[]> = {}
    let order: string[] = []

    if (currentMode === 'dishType') {
      DISH_TYPE_ORDER.forEach((t) => {
        map[t] = []
        order.push(t)
      })
    }

    recipes.value.forEach((recipe, index) => {
      const key = currentMode === 'dishType' ? recipe.dishType : recipe.category
      if (!map[key]) {
        map[key] = []
        order.push(key)
      }
      map[key].push({ recipe, index })
    })

    if (currentMode === 'dishType') {
      order = DISH_TYPE_ORDER.filter((t) => map[t] && map[t].length)
    }

    return { map, order }
  }

  function setMode(next: FushiMode) {
    mode.value = next
    view.value = 'categories'
    groupKey.value = null
    recipeIndex.value = null
  }

  function openGroup(key: string) {
    groupKey.value = key
    view.value = 'recipes'
    recipeIndex.value = null
  }

  function openRecipe(index: number) {
    recipeIndex.value = index
    view.value = 'detail'
  }

  function openShopping() {
    view.value = 'shopping'
  }

  function openTips() {
    view.value = 'tips'
  }

  function goHome() {
    view.value = 'categories'
    groupKey.value = null
    recipeIndex.value = null
  }

  function goBack() {
    if (view.value === 'detail') {
      view.value = 'recipes'
      recipeIndex.value = null
    } else if (view.value === 'recipes') {
      goHome()
    } else if (view.value === 'shopping' || view.value === 'tips') {
      goHome()
    }
  }

  return {
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
    DISH_TYPE_ICON,
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
  }
}
