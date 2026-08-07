import ergeJson from './erge.json'

export const pageConfig = {
  name: 'erge',
  title: '儿歌',
  path: '/erge',
} as const

export interface Song {
  id: number
  title: string
  summary: string
  minutes: number
  age: string
  tag: string
  lyrics: string[]
}

export interface ErgeData {
  title: string
  subtitle: string
  tags?: string[]
  songs: Song[]
}

export const ergeData = ergeJson as ErgeData

export function getSongById(id: number | string) {
  const num = Number(id)
  if (!Number.isFinite(num)) return null
  return ergeData.songs.find((item) => item.id === num) ?? null
}

export function getAllTags() {
  if (ergeData.tags?.length) return [...ergeData.tags]
  return [...new Set(ergeData.songs.map((item) => item.tag))]
}

export function parseRouteParam(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return value == null ? '' : String(value)
}

export const FAVORITES_STORAGE_KEY = 'erge-favorites'

export function readFavoriteIds(): number[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const idSet = new Set(ergeData.songs.map((item) => item.id))
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

export function getFavoriteSongs() {
  const idSet = new Set(readFavoriteIds())
  return ergeData.songs.filter((song) => idSet.has(song.id))
}

export const LYRIC_FONT_STORAGE_KEY = 'erge-lyric-font-size'
export const LYRIC_FONT_DEFAULT = 17
export const LYRIC_FONT_MAX = 30

export function readLyricFontSize() {
  try {
    const raw = localStorage.getItem(LYRIC_FONT_STORAGE_KEY)
    const num = Number(raw)
    if (Number.isFinite(num) && num >= LYRIC_FONT_DEFAULT && num <= LYRIC_FONT_MAX) {
      return Math.round(num)
    }
  } catch {
    // ignore
  }
  return LYRIC_FONT_DEFAULT
}

export function saveLyricFontSize(size: number) {
  try {
    localStorage.setItem(LYRIC_FONT_STORAGE_KEY, String(size))
  } catch {
    // ignore
  }
}
