import { publicUrl } from '@/utils/publicUrl'

export const pageConfig = {
  name: 'chengzhang',
  title: '成长',
  path: '/chengzhang',
  playMs: 3000,
  images: [
    publicUrl('chengzhang/images/1.JPG'),
    publicUrl('chengzhang/images/2.JPG'),
    publicUrl('chengzhang/images/3.JPG'),
    publicUrl('chengzhang/images/4.JPG'),
  ],
} as const
