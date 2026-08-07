import data from './wenzi.json'

export interface WenziItem {
  id: number
  char: string
  pinyin: string
  summary: string
  meaning: string
  words: string[]
  tip: string
}

export interface WenziData {
  title: string
  subtitle: string
  items: WenziItem[]
}

export const wenziData = data as WenziData

export function getWenziById(id: number | string) {
  const num = Number(id)
  return wenziData.items.find((item) => item.id === num) ?? null
}
