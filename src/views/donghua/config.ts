import donghuaJson from './donghua.json'

export const pageConfig = {
  name: 'donghua',
  title: '动画',
  path: '/donghua',
} as const

/** 暂时统一的演示播放地址，后续可按条目替换 */
export const DEMO_PLAY_URL = 'https://www.youtube.com/embed/aqz-KE-bpKQ?rel=0'

export interface AnimeItem {
  id: number
  title: string
  summary: string
  minutes: number
  age: string
  tag: string
  playUrl: string
}

export interface DonghuaData {
  title: string
  subtitle: string
  tags?: string[]
  items: AnimeItem[]
}

export const donghuaData = donghuaJson as DonghuaData

export function getAnimeById(id: number | string) {
  const num = Number(id)
  if (!Number.isFinite(num)) return null
  return donghuaData.items.find((item) => item.id === num) ?? null
}

export function getPlayUrl(item: AnimeItem | null) {
  return item?.playUrl || DEMO_PLAY_URL
}

export function getAllTags() {
  if (donghuaData.tags?.length) return [...donghuaData.tags]
  return [...new Set(donghuaData.items.map((item) => item.tag))]
}

export function parseRouteParam(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return value == null ? '' : String(value)
}

export const FAVORITES_STORAGE_KEY = 'donghua-favorites'

export function readFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const idSet = new Set(donghuaData.items.map((item) => item.id))
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

export function getFavoriteAnimes() {
  const idSet = new Set(readFavoriteIds())
  return donghuaData.items.filter((item) => idSet.has(item.id))
}
