import { createRouter, createWebHistory } from 'vue-router'
import { pageConfig as homeConfig } from '@/views/home/config'
import { pageConfig as fushiConfig } from '@/views/fushi/config'
import { pageConfig as chengzhangConfig } from '@/views/chengzhang/config'
import { pageConfig as donghuaConfig } from '@/views/donghua/config'
import { pageConfig as ergeConfig } from '@/views/erge/config'
import { pageConfig as gushiConfig } from '@/views/gushi/config'
import { pageConfig as xuexiConfig } from '@/views/xuexi/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: homeConfig.path,
      name: homeConfig.name,
      component: () => import('@/views/home/index.vue'),
      meta: { title: homeConfig.title },
    },
    {
      path: fushiConfig.path,
      name: fushiConfig.name,
      component: () => import('@/views/fushi/index.vue'),
      meta: { title: fushiConfig.title },
    },
    {
      path: chengzhangConfig.path,
      name: chengzhangConfig.name,
      component: () => import('@/views/chengzhang/index.vue'),
      meta: { title: chengzhangConfig.title },
    },
    {
      path: donghuaConfig.path,
      name: donghuaConfig.name,
      component: () => import('@/views/donghua/index.vue'),
      meta: { title: donghuaConfig.title },
    },
    {
      path: ergeConfig.path,
      name: ergeConfig.name,
      component: () => import('@/views/erge/index.vue'),
      meta: { title: ergeConfig.title },
    },
    {
      path: gushiConfig.path,
      name: gushiConfig.name,
      component: () => import('@/views/gushi/index.vue'),
      meta: { title: gushiConfig.title },
    },
    {
      path: xuexiConfig.path,
      name: xuexiConfig.name,
      component: () => import('@/views/xuexi/index.vue'),
      meta: { title: xuexiConfig.title },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'YCY'
  document.title = title
})

export default router
