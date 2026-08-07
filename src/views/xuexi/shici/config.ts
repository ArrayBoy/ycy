import data from './shici.json'

export interface ShiciItem {
  id: number
  title: string
  author: string
  dynasty: string
  summary: string
  lines: string[]
  note: string
}

export interface ShiciData {
  title: string
  subtitle: string
  items: ShiciItem[]
}

export const shiciData = data as ShiciData

export function getShiciById(id: number | string) {
  const num = Number(id)
  return shiciData.items.find((item) => item.id === num) ?? null
}
