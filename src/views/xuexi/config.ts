export const pageConfig = {
  name: 'xuexi',
  title: '学习',
  path: '/xuexi',
  subtitle: '启蒙小课堂',
} as const

export type XuexiModuleKey = 'shici' | 'shuzi' | 'wenzi' | 'yingyu'

export interface XuexiModuleMeta {
  key: XuexiModuleKey
  name: string
  hint: string
  path: string
  routeName: string
  listName: string
  detailName: string
  accentFrom: string
  accentTo: string
  mark: string
}

export const modules: XuexiModuleMeta[] = [
  {
    key: 'shici',
    name: '诗词',
    hint: '读一读古诗词',
    path: 'shici',
    routeName: 'xuexi-shici',
    listName: 'xuexi-shici',
    detailName: 'xuexi-shici-detail',
    accentFrom: '#5eead4',
    accentTo: '#0d9488',
    mark: '诗',
  },
  {
    key: 'shuzi',
    name: '数字',
    hint: '认一认数字',
    path: 'shuzi',
    routeName: 'xuexi-shuzi',
    listName: 'xuexi-shuzi',
    detailName: 'xuexi-shuzi-detail',
    accentFrom: '#67e8f9',
    accentTo: '#0891b2',
    mark: '1',
  },
  {
    key: 'wenzi',
    name: '文字',
    hint: '学一学汉字',
    path: 'wenzi',
    routeName: 'xuexi-wenzi',
    listName: 'xuexi-wenzi',
    detailName: 'xuexi-wenzi-detail',
    accentFrom: '#6ee7b7',
    accentTo: '#059669',
    mark: '字',
  },
  {
    key: 'yingyu',
    name: '英语',
    hint: '说一说英文',
    path: 'yingyu',
    routeName: 'xuexi-yingyu',
    listName: 'xuexi-yingyu',
    detailName: 'xuexi-yingyu-detail',
    accentFrom: '#99f6e4',
    accentTo: '#0f766e',
    mark: 'A',
  },
]

export function getModuleByKey(key: string) {
  return modules.find((item) => item.key === key)
}

export function parseRouteParam(value: unknown): string {
  if (Array.isArray(value)) return String(value[0] ?? '')
  return value == null ? '' : String(value)
}
