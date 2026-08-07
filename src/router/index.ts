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
  // 不传 './' base，避免相对 base 在部分环境下匹配异常
  history: createWebHashHistory(),
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
      component: () => import('@/views/donghua/index.vue'),
      meta: { title: donghuaConfig.title },
      children: [
        {
          path: '',
          name: donghuaConfig.name,
          component: () => import('@/views/donghua/components/AnimeList.vue'),
          meta: { title: donghuaConfig.title },
        },
        {
          path: 'detail/:id',
          name: 'donghua-detail',
          component: () => import('@/views/donghua/components/AnimeDetail.vue'),
          meta: { title: '动画详情' },
        },
      ],
    },
    {
      path: ergeConfig.path,
      component: () => import('@/views/erge/index.vue'),
      meta: { title: ergeConfig.title },
      children: [
        {
          path: '',
          name: ergeConfig.name,
          component: () => import('@/views/erge/components/SongList.vue'),
          meta: { title: ergeConfig.title },
        },
        {
          path: 'detail/:id',
          name: 'erge-detail',
          component: () => import('@/views/erge/components/SongDetail.vue'),
          meta: { title: '儿歌详情' },
        },
      ],
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
      component: () => import('@/views/xuexi/index.vue'),
      meta: { title: xuexiConfig.title },
      children: [
        {
          path: '',
          name: xuexiConfig.name,
          component: () => import('@/views/xuexi/Home.vue'),
          meta: { title: xuexiConfig.title },
        },
        {
          path: 'shici',
          name: 'xuexi-shici',
          component: () => import('@/views/xuexi/shici/List.vue'),
          meta: { title: '诗词' },
        },
        {
          path: 'shici/:id',
          name: 'xuexi-shici-detail',
          component: () => import('@/views/xuexi/shici/Detail.vue'),
          meta: { title: '诗词详情' },
        },
        {
          path: 'shuzi',
          name: 'xuexi-shuzi',
          component: () => import('@/views/xuexi/shuzi/List.vue'),
          meta: { title: '数字' },
        },
        {
          path: 'shuzi/:id',
          name: 'xuexi-shuzi-detail',
          component: () => import('@/views/xuexi/shuzi/Detail.vue'),
          meta: { title: '数字详情' },
        },
        {
          path: 'wenzi',
          name: 'xuexi-wenzi',
          component: () => import('@/views/xuexi/wenzi/List.vue'),
          meta: { title: '文字' },
        },
        {
          path: 'wenzi/:id',
          name: 'xuexi-wenzi-detail',
          component: () => import('@/views/xuexi/wenzi/Detail.vue'),
          meta: { title: '文字详情' },
        },
        {
          path: 'yingyu',
          name: 'xuexi-yingyu',
          component: () => import('@/views/xuexi/yingyu/List.vue'),
          meta: { title: '英语' },
        },
        {
          path: 'yingyu/:id',
          name: 'xuexi-yingyu-detail',
          component: () => import('@/views/xuexi/yingyu/Detail.vue'),
          meta: { title: '英语详情' },
        },
      ],
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
