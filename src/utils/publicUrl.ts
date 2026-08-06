/** 拼接 public 静态资源路径，兼容 base: './' 的纯静态部署 */
export function publicUrl(path: string) {
  const base = import.meta.env.BASE_URL || './'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}
