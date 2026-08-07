import data from './yingyu.json'

export interface YingyuItem {
  id: number
  word: string
  phonetic: string
  summary: string
  meaning: string
  category: string
  example: string
  exampleZh: string
}

export interface YingyuData {
  title: string
  subtitle: string
  items: YingyuItem[]
}

export const yingyuData = data as YingyuData

export function getYingyuById(id: number | string) {
  const num = Number(id)
  return yingyuData.items.find((item) => item.id === num) ?? null
}
