import fushiJson from './fushi.json'

export const pageConfig = {
  name: 'fushi',
  title: '辅食',
  path: '/fushi',
} as const

export interface CategoryItem {
  label: string
  type: number
}

export interface DishTypeItem {
  label: string
  type: number
}

export interface Recipe {
  categoryType: number
  dishType: number
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
  categorys: CategoryItem[]
  dishTypes: DishTypeItem[]
  recipes: Recipe[]
  weekly_shopping_list: ShoppingItem[]
  tips_and_tricks: TipItem[]
}

export type FushiMode = 'category' | 'dishType'

/** icon 按 dishTypes.type 映射 */
export const DISH_TYPE_ICON: Record<number, string> = {
  1: '🍚',
  2: '🍜',
  3: '🥣',
  4: '🥞',
  5: '🧁',
  6: '✋',
}

const CN_NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']

export const fushiData = fushiJson as FushiData

const categoryMap = new Map(fushiData.categorys.map((item) => [item.type, item]))
const dishTypeMap = new Map(fushiData.dishTypes.map((item) => [item.type, item]))

export function getCategoryLabel(type: number | string) {
  const num = Number(type)
  return categoryMap.get(num)?.label ?? String(type)
}

export function getDishTypeLabel(type: number | string) {
  const num = Number(type)
  return dishTypeMap.get(num)?.label ?? String(type)
}

export function categoryNumber(type: number | string) {
  const num = Number(type)
  if (!Number.isFinite(num) || num < 1) return '·'
  return CN_NUMBERS[num - 1] ?? String(num)
}

export function displayGroupName(mode: FushiMode, type: number | string) {
  return mode === 'dishType' ? getDishTypeLabel(type) : getCategoryLabel(type)
}

export function isFushiMode(value: unknown): value is FushiMode {
  return value === 'category' || value === 'dishType'
}

export function parseFushiMode(value: unknown): FushiMode {
  const raw = Array.isArray(value) ? value[0] : value
  return isFushiMode(raw) ? raw : 'category'
}

export function parseRouteParam(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return value == null ? '' : String(value)
}

export function groupRecipes(mode: FushiMode) {
  const map: Record<string, { recipe: Recipe; index: number }[]> = {}
  const source = mode === 'dishType' ? fushiData.dishTypes : fushiData.categorys

  source.forEach((item) => {
    map[String(item.type)] = []
  })

  fushiData.recipes.forEach((recipe, index) => {
    const key = String(mode === 'dishType' ? recipe.dishType : recipe.categoryType)
    if (!map[key]) map[key] = []
    map[key].push({ recipe, index })
  })

  const order = source
    .map((item) => String(item.type))
    .filter((key) => map[key]?.length)

  return { map, order }
}

export function getRecipesByGroup(mode: FushiMode, type: number | string) {
  return groupRecipes(mode).map[String(type)] ?? []
}

export function cleanStep(step: string) {
  return String(step).replace(/^\d+[\.、]\s*/, '')
}

export const DETAIL_FONT_STORAGE_KEY = 'fushi-detail-font-size'
export const DETAIL_FONT_DEFAULT = 14
export const DETAIL_FONT_MAX = 28

export function readDetailFontSize() {
  try {
    const raw = localStorage.getItem(DETAIL_FONT_STORAGE_KEY)
    const num = Number(raw)
    if (Number.isFinite(num) && num >= DETAIL_FONT_DEFAULT && num <= DETAIL_FONT_MAX) {
      return Math.round(num)
    }
  } catch {
    // ignore
  }
  return DETAIL_FONT_DEFAULT
}

export function saveDetailFontSize(size: number) {
  try {
    localStorage.setItem(DETAIL_FONT_STORAGE_KEY, String(size))
  } catch {
    // ignore
  }
}

