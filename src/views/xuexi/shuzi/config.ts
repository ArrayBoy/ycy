import data from './shuzi.json'

export interface ShuziItem {
  id: number
  num: number
  chinese: string
  pinyin: string
  summary: string
  tip: string
  examples: string[]
}

export interface ShuziData {
  title: string
  subtitle: string
  items: ShuziItem[]
}

export const shuziData = data as ShuziData

export function getShuziById(id: number | string) {
  const num = Number(id)
  return shuziData.items.find((item) => item.id === num) ?? null
}
