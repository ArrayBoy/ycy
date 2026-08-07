import { publicUrl } from '@/utils/publicUrl'

export interface MenuItem {
  key: string
  name: string
  hint: string
  to: string
  icon: string
  from: string
  toColor: string
}

export const pageConfig = {
  name: 'home',
  title: 'YCY · 宝宝成长站',
  path: '/',
  brand: '杨宸烨',
  tagline: '宝宝成长站',
  footer: '轻轻点一点，开启今天的陪伴',
  avatar: publicUrl('piblic/tx.jpg'),
} as const

export const menus: MenuItem[] = [
  {
    key: 'fushi',
    name: '辅食',
    hint: '营养菜谱',
    to: '/fushi',
    from: '#ffd08a',
    toColor: '#f0a94a',
    icon: 'M8.1 3.5c.4-.9 1.7-.9 2.1 0L12 6.2l1.8-2.7c.4-.9 1.7-.9 2.1 0l1.5 2.9 3.2.5c1 .1 1.4 1.3.7 2l-2.3 2.2.5 3.2c.2 1-.8 1.7-1.7 1.3L15 14.2l-2.9 1.5c-.9.5-1.9-.3-1.7-1.3l.5-3.2-2.3-2.2c-.7-.7-.3-1.9.7-2l3.2-.5L8.1 3.5zM4 18h16v2H4v-2z',
  },
  {
    key: 'chengzhang',
    name: '成长',
    hint: '记录点滴',
    to: '/chengzhang',
    from: '#fcd34d',
    toColor: '#f59e0b',
    icon: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.8 7.2 17l.9-5.4L4.2 7.7l5.4-.8L12 2zm-7 18h14v2H5v-2z',
  },
  {
    key: 'gushi',
    name: '故事',
    hint: '睡前听听',
    to: '/gushi',
    from: '#9fd8f0',
    toColor: '#5eb3d4',
    icon: 'M6 4h9a3 3 0 0 1 3 3v13l-4.5-2.5L9 20V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v11H3V7a3 3 0 0 1 3-3z',
  },
  {
    key: 'xuexi',
    name: '学习',
    hint: '启蒙小课堂',
    to: '/xuexi',
    from: '#5eead4',
    toColor: '#14b8a6',
    icon: 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v3.32L12 20l7-3.5v-3.32L12 16.5 5 13.18z',
  },
  {
    key: 'donghua',
    name: '动画',
    hint: '快乐看动画',
    to: '/donghua',
    from: '#9be8c8',
    toColor: '#5fbf9a',
    icon: 'M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1.5l3.2-1.8a1 1 0 0 1 1.5.87v9.86a1 1 0 0 1-1.5.87L16 14.5V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z',
  },
  {
    key: 'erge',
    name: '儿歌',
    hint: '唱唱跳跳',
    to: '/erge',
    from: '#ffb4a2',
    toColor: '#f08a6b',
    icon: 'M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z',
  },
]
