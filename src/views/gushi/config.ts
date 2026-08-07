import gushiJson from './gushi.json'

export const pageConfig = {
  name: 'gushi',
  title: '故事',
  path: '/gushi',
} as const

export interface Story {
  id: number
  title: string
  summary: string
  minutes: number
  age: string
  tag: string
  content: string[]
}

export interface GushiData {
  title: string
  subtitle: string
  tags?: string[]
  stories: Story[]
}

export const gushiData = gushiJson as GushiData

export function getStoryById(id: number | string) {
  const num = Number(id)
  if (!Number.isFinite(num)) return null
  return gushiData.stories.find((item) => item.id === num) ?? null
}

export function getAllTags() {
  if (gushiData.tags?.length) return [...gushiData.tags]
  return [...new Set(gushiData.stories.map((item) => item.tag))]
}

export function parseRouteParam(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return value == null ? '' : String(value)
}

export const FAVORITES_STORAGE_KEY = 'gushi-favorites'

export function readFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const idSet = new Set(gushiData.stories.map((item) => item.id))
    return parsed
      .map((item) => Number(item))
      .filter((id) => Number.isInteger(id) && idSet.has(id))
  } catch {
    return []
  }
}

export function saveFavoriteIds(ids: number[]) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

export function isFavorite(id: number) {
  return readFavoriteIds().includes(id)
}

export function toggleFavorite(id: number) {
  const list = readFavoriteIds()
  const pos = list.indexOf(id)
  if (pos >= 0) list.splice(pos, 1)
  else list.unshift(id)
  saveFavoriteIds(list)
  return list.includes(id)
}

export function getFavoriteStories() {
  const idSet = new Set(readFavoriteIds())
  return gushiData.stories.filter((story) => idSet.has(story.id))
}

export const STORY_FONT_STORAGE_KEY = 'gushi-story-font-size'
export const STORY_FONT_DEFAULT = 16
export const STORY_FONT_MAX = 30

export function readStoryFontSize() {
  try {
    const raw = localStorage.getItem(STORY_FONT_STORAGE_KEY)
    const num = Number(raw)
    if (Number.isFinite(num) && num >= STORY_FONT_DEFAULT && num <= STORY_FONT_MAX) {
      return Math.round(num)
    }
  } catch {
    // ignore
  }
  return STORY_FONT_DEFAULT
}

export function saveStoryFontSize(size: number) {
  try {
    localStorage.setItem(STORY_FONT_STORAGE_KEY, String(size))
  } catch {
    // ignore
  }
}
