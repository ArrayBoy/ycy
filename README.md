# YCY · 宝宝成长站

Vue 3 + TypeScript + Vite + Vue Router + Axios + Tailwind CSS + SCSS + pnpm  
（Pinia 暂未使用）

## 模块约定

每个页面模块位于 `src/views/<module>/`：

- `index.vue`：页面组件
- `config.ts`：路由与页面配置
- `index.scss`：模块样式（如有）

## 开发

```bash
pnpm install
pnpm dev
```

启动后会监听 `0.0.0.0`，并自动用本机局域网 IP 打开浏览器。

## 构建

```bash
pnpm build
pnpm preview
```

构建产物输出到 `docs/`（可提交仓库），并生成 `.gz` 压缩文件；图片等静态资源会在构建时做体积优化。

## 功能

- 首页菜单：辅食 / 成长 / 动画 / 儿歌 / 故事 / 学习
- 辅食：菜谱浏览、采购清单、烹饪技巧（数据来自 `src/views/fushi/fushi.json`）
- 成长：图片播放器（`public/chengzhang/images`）
