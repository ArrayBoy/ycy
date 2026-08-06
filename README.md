# YCY · 宝宝成长站

Vue 3 + TypeScript + Vite + Vue Router + Axios + Tailwind CSS + SCSS + pnpm  
（Pinia 暂未使用）

## 环境

- Node.js >= 18
- 包管理器：pnpm

```bash
pnpm install
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm start` / `pnpm dev` | 启动开发服务（监听局域网 IP，并自动打开浏览器） |
| `pnpm build` | 类型检查 + 打包，产物输出到 `docs/` |
| `pnpm preview` | 本地预览打包结果 |
| `pnpm typecheck` | 仅做 TypeScript / Vue 类型检查 |
| `pnpm clean` | 清理 `docs` 构建产物 |

## 模块约定

每个页面模块位于 `src/views/<module>/`：

- `index.vue`：页面组件（可含样式）
- `config.ts`：路由与页面配置
- `components/`：模块内子组件（如有）

## 功能

- 首页菜单：辅食 / 成长 / 动画 / 儿歌 / 故事 / 学习
- 辅食：菜谱浏览、采购清单、烹饪技巧（数据来自 `src/views/fushi/fushi.json`）
- 成长：图片播放器（`public/chengzhang/images`）

构建会生成 gzip（`.gz`），并对图片等静态资源做压缩优化。`docs/` 可提交到仓库。
