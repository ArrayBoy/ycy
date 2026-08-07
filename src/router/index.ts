import { createRouter, createWebHashHistory } from 'vue-router'
import { pageConfig as homeConfig } from '@/views/home/config'
import { pageConfig as fushiConfig } from '@/views/fushi/config'
import { pageConfig as chengzhangConfig } from '@/views/chengzhang/config'
import { pageConfig as donghuaConfig } from '@/views/donghua/config'
import { pageConfig as ergeConfig } from '@/views/erge/config'
import { pageConfig as gushiConfig } from '@/views/gushi/config'
import { pageConfig as xuexiConfig } from '@/views/xuexi/config'

const router = createRouter({
  // Hash 路由：纯静态部署可直接打开 index.html，无需服务端回退
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: homeConfig.path,
      name: homeConfig.name,
      component: () => import('@/views/home/index.vue'),
      meta: { title: homeConfig.title },
    },
    {
      path: fushiConfig.path,
      component: () => import('@/views/fushi/index.vue'),
      meta: { title: fushiConfig.title },
      children: [
        {
          path: '',
          name: fushiConfig.name,
          component: () => import('@/views/fushi/components/CategoryList.vue'),
          meta: { title: fushiConfig.title },
        },
        {
          path: 'list/:mode/:type',
          name: 'fushi-list',
          component: () => import('@/views/fushi/components/RecipeList.vue'),
          meta: { title: '菜谱列表' },
        },
        {
          path: 'detail/:index',
          name: 'fushi-detail',
          component: () => import('@/views/fushi/components/RecipeDetail.vue'),
          meta: { title: '菜谱详情' },
        },
        {
          path: 'shopping',
          name: 'fushi-shopping',
          component: () => import('@/views/fushi/components/Shopping.vue'),
          meta: { title: '周采购清单' },
        },
        {
          path: 'tips',
          name: 'fushi-tips',
          component: () => import('@/views/fushi/components/Tips.vue'),
          meta: { title: '烹饪小技巧' },
        },
        {
          path: 'favorites',
          name: 'fushi-favorites',
          component: () => import('@/views/fushi/components/Favorites.vue'),
          meta: { title: '我的收藏' },
        },
      ],
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
      component: () => import('@/views/gushi/index.vue'),
      meta: { title: gushiConfig.title },
      children: [
        {
          path: '',
          name: gushiConfig.name,
          component: () => import('@/views/gushi/components/StoryList.vue'),
          meta: { title: gushiConfig.title },
        },
        {
          path: 'detail/:id',
          name: 'gushi-detail',
          component: () => import('@/views/gushi/components/StoryDetail.vue'),
          meta: { title: '故事详情' },
        },
      ],
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
