<template>
  <div class="xuexi-draw" :class="{ 'is-fullscreen': isFullscreen }">
    <button
      v-if="isFullscreen"
      class="xuexi-draw__settings"
      type="button"
      aria-label="设置"
      :aria-expanded="panelOpen"
      @click.stop="togglePanel"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.83 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.14.24.43.34.68.24l2.39-.96c.5.39 1.04.7 1.63.94l.36 2.54c.05.24.26.42.5.42h3.84c.24 0 .45-.18.5-.42l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.25.1.54 0 .68-.24l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
        />
      </svg>
    </button>

    <div
      v-if="isFullscreen && panelOpen"
      class="xuexi-draw__panel-mask"
      @click="closePanel"
    />

    <div
      v-show="!isFullscreen || panelOpen"
      class="xuexi-draw__toolbar"
      :class="{ 'is-floating': isFullscreen }"
      @click.stop
    >
      <div class="xuexi-draw__row xuexi-draw__row--selects">
        <div class="xuexi-draw__dropdown" :class="{ open: openMenu === 'bg' }">
          <button
            class="xuexi-draw__select"
            type="button"
            aria-label="背景色"
            aria-haspopup="listbox"
            :aria-expanded="openMenu === 'bg'"
            @click.stop="toggleMenu('bg')"
          >
            <span
              class="xuexi-draw__swatch"
              :class="{ light: isLightColor(bgColor) }"
              :style="{ background: bgColor }"
            />
            <span class="xuexi-draw__select-text">{{ bgName(bgColor) }}</span>
            <span class="xuexi-draw__caret" aria-hidden="true">▾</span>
          </button>
          <div v-if="openMenu === 'bg'" class="xuexi-draw__menu xuexi-draw__menu--colors" role="listbox">
            <button
              v-for="c in bgOptions"
              :key="c.value"
              class="xuexi-draw__menu-item"
              type="button"
              role="option"
              :aria-selected="bgColor === c.value"
              :class="{ active: bgColor === c.value }"
              @click.stop="pickBg(c.value)"
            >
              <span
                class="xuexi-draw__swatch"
                :class="{ light: isLightColor(c.value) }"
                :style="{ background: c.value }"
              />
              <span>{{ c.label }}</span>
            </button>
          </div>
        </div>

        <div class="xuexi-draw__dropdown" :class="{ open: openMenu === 'color' }">
          <button
            class="xuexi-draw__select"
            type="button"
            aria-label="颜色"
            aria-haspopup="listbox"
            :aria-expanded="openMenu === 'color'"
            @click.stop="toggleMenu('color')"
          >
            <span
              class="xuexi-draw__swatch"
              :class="{ light: isLightColor(color) }"
              :style="{ background: color }"
            />
            <span class="xuexi-draw__select-text">{{ colorName(color) }}</span>
            <span class="xuexi-draw__caret" aria-hidden="true">▾</span>
          </button>
          <div v-if="openMenu === 'color'" class="xuexi-draw__menu xuexi-draw__menu--colors" role="listbox">
            <button
              v-for="c in colorOptions"
              :key="c.value"
              class="xuexi-draw__menu-item"
              type="button"
              role="option"
              :aria-selected="color === c.value"
              :class="{ active: color === c.value }"
              @click.stop="pickColor(c.value)"
            >
              <span
                class="xuexi-draw__swatch"
                :class="{ light: isLightColor(c.value) }"
                :style="{ background: c.value }"
              />
              <span>{{ c.label }}</span>
            </button>
          </div>
        </div>

        <div class="xuexi-draw__dropdown" :class="{ open: openMenu === 'size' }">
          <button
            class="xuexi-draw__select"
            type="button"
            aria-label="笔画"
            aria-haspopup="listbox"
            :aria-expanded="openMenu === 'size'"
            @click.stop="toggleMenu('size')"
          >
            <span class="xuexi-draw__dot" :style="{ width: `${Math.max(4, size)}px`, height: `${Math.max(4, size)}px` }" />
            <span class="xuexi-draw__select-text">{{ sizeLabel(size) }}</span>
            <span class="xuexi-draw__caret" aria-hidden="true">▾</span>
          </button>
          <div v-if="openMenu === 'size'" class="xuexi-draw__menu" role="listbox">
            <button
              v-for="s in sizeOptions"
              :key="s.value"
              class="xuexi-draw__menu-item"
              type="button"
              role="option"
              :aria-selected="size === s.value"
              :class="{ active: size === s.value }"
              @click.stop="pickSize(s.value)"
            >
              <span class="xuexi-draw__dot" :style="{ width: `${Math.max(4, s.value)}px`, height: `${Math.max(4, s.value)}px` }" />
              <span>{{ s.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="xuexi-draw__row xuexi-draw__row--actions">
        <button class="xuexi-draw__btn" type="button" :disabled="!strokes.length" @click="undo">撤销</button>
        <button class="xuexi-draw__btn xuexi-draw__btn--danger" type="button" :disabled="!strokes.length" @click="clearAll">
          清除
        </button>
        <button
          class="xuexi-draw__btn xuexi-draw__btn--save"
          type="button"
          :disabled="!strokes.length || saving"
          @click="askSave"
        >
          {{ saving ? '保存中…' : '保存' }}
        </button>
        <button
          class="xuexi-draw__fs-btn"
          type="button"
          :aria-label="isFullscreen ? '退出全屏' : '全屏'"
          @click="toggleFullscreen"
        >
          {{ isFullscreen ? '退出' : '全屏' }}
        </button>
      </div>
    </div>

    <div ref="stageRef" class="xuexi-draw__stage" :style="{ background: bgColor }">
      <canvas
        ref="canvasRef"
        class="xuexi-draw__canvas"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      />
    </div>

    <div
      v-if="confirmVisible"
      class="xuexi-draw__mask"
      role="dialog"
      aria-modal="true"
      aria-label="确认保存？"
      @click.self="closeConfirm"
    >
      <div class="xuexi-draw__dialog">
        <h2 class="xuexi-draw__dialog-title">确认保存？</h2>
        <p class="xuexi-draw__dialog-desc">将把当前画作保存为图片到手机。</p>
        <div class="xuexi-draw__dialog-actions">
          <button class="xuexi-draw__btn" type="button" @click="closeConfirm">取消</button>
          <button class="xuexi-draw__btn xuexi-draw__btn--save" type="button" @click="confirmSave">
            确认保存
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastVisible" class="xuexi-draw__toast">{{ toastText }}</div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

interface Point {
  x: number
  y: number
}

interface Stroke {
  color: string
  size: number
  points: Point[]
}

type MenuKey = 'bg' | 'color' | 'size' | null

const bgOptions = [
  { value: '#ffffff', label: '白色' },
  { value: '#f3f4f6', label: '浅灰' },
  { value: '#fef9c3', label: '淡黄' },
  { value: '#ffedd5', label: '杏色' },
  { value: '#fce7f3', label: '浅粉' },
  { value: '#e0f2fe', label: '天蓝' },
  { value: '#dcfce7', label: '浅绿' },
  { value: '#ccfbf1', label: '薄荷' },
  { value: '#f3e8ff', label: '浅紫' },
  { value: '#1e293b', label: '深灰' },
]

const colorOptions = [
  { value: '#111827', label: '黑色' },
  { value: '#6b7280', label: '灰色' },
  { value: '#ef4444', label: '红色' },
  { value: '#f97316', label: '橙色' },
  { value: '#eab308', label: '黄色' },
  { value: '#84cc16', label: '黄绿' },
  { value: '#22c55e', label: '绿色' },
  { value: '#14b8a6', label: '青绿' },
  { value: '#06b6d4', label: '青色' },
  { value: '#3b82f6', label: '蓝色' },
  { value: '#6366f1', label: '靛蓝' },
  { value: '#8b5cf6', label: '紫色' },
  { value: '#a855f7', label: '亮紫' },
  { value: '#ec4899', label: '粉色' },
  { value: '#f43f5e', label: '玫红' },
  { value: '#a16207', label: '棕色' },
  { value: '#78716c', label: '石灰' },
  { value: '#ffffff', label: '白色' },
]

const sizeOptions = [
  { value: 2, label: '极细' },
  { value: 3, label: '很细' },
  { value: 4, label: '细' },
  { value: 5, label: '中细' },
  { value: 7, label: '中' },
  { value: 9, label: '中粗' },
  { value: 11, label: '粗' },
  { value: 14, label: '很粗' },
  { value: 18, label: '极粗' },
]

const bgColor = ref('#ffffff')
const color = ref('#111827')
const size = ref(4)
const stageRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const saving = ref(false)
const toastVisible = ref(false)
const toastText = ref('')
const confirmVisible = ref(false)
const isFullscreen = ref(false)
const panelOpen = ref(false)
const openMenu = ref<MenuKey>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null
let previousOverflow = ''

const strokes = ref<Stroke[]>([])
let drawing = false
let currentStroke: Stroke | null = null
let dpr = 1
let resizeObserver: ResizeObserver | null = null

function bgName(value: string) {
  return bgOptions.find((item) => item.value === value)?.label || '背景'
}

function colorName(value: string) {
  return colorOptions.find((item) => item.value === value)?.label || '颜色'
}

function sizeLabel(value: number) {
  return sizeOptions.find((item) => item.value === value)?.label || '笔画'
}

function isLightColor(value: string) {
  const light = new Set([
    '#ffffff',
    '#f3f4f6',
    '#fef9c3',
    '#ffedd5',
    '#fce7f3',
    '#e0f2fe',
    '#dcfce7',
    '#ccfbf1',
    '#f3e8ff',
    '#eab308',
    '#84cc16',
  ])
  return light.has(value)
}

function showToast(text: string) {
  toastText.value = text
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
    toastTimer = null
  }, 2200)
}

function toggleMenu(key: Exclude<MenuKey, null>) {
  openMenu.value = openMenu.value === key ? null : key
}

function closeMenus() {
  openMenu.value = null
}

function togglePanel() {
  panelOpen.value = !panelOpen.value
  if (!panelOpen.value) closeMenus()
}

function closePanel() {
  panelOpen.value = false
  closeMenus()
}

function pickBg(value: string) {
  bgColor.value = value
  closeMenus()
  redraw()
}

function pickColor(value: string) {
  color.value = value
  closeMenus()
}

function pickSize(value: number) {
  size.value = value
  closeMenus()
}

function askSave() {
  closeMenus()
  if (!strokes.value.length || saving.value) return
  confirmVisible.value = true
}

function closeConfirm() {
  confirmVisible.value = false
}

function confirmSave() {
  closeConfirm()
  void saveImage()
}

async function toggleFullscreen() {
  closeMenus()
  const next = !isFullscreen.value
  isFullscreen.value = next
  panelOpen.value = false
  if (next) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.classList.add('xuexi-draw-fs-active')
  } else {
    document.body.style.overflow = previousOverflow
    document.documentElement.classList.remove('xuexi-draw-fs-active')
  }
  await nextTick()
  resizeCanvas()
}

function exitFullscreen() {
  if (!isFullscreen.value) return
  isFullscreen.value = false
  panelOpen.value = false
  closeMenus()
  document.body.style.overflow = previousOverflow
  document.documentElement.classList.remove('xuexi-draw-fs-active')
}

function getCtx() {
  const canvas = canvasRef.value
  if (!canvas) return null
  return canvas.getContext('2d')
}

function resizeCanvas() {
  const stage = stageRef.value
  const canvas = canvasRef.value
  if (!stage || !canvas) return

  const rect = stage.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.max(1, Math.floor(rect.width))
  const h = Math.max(1, Math.floor(rect.height))

  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  const ctx = getCtx()
  if (!ctx) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  redraw()
}

function clearCanvas() {
  const canvas = canvasRef.value
  const ctx = getCtx()
  if (!canvas || !ctx) return
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

function drawStroke(stroke: Stroke) {
  const ctx = getCtx()
  if (!ctx || stroke.points.length === 0) return

  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.size
  ctx.beginPath()
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
  }
  if (stroke.points.length === 1) {
    ctx.lineTo(stroke.points[0].x + 0.01, stroke.points[0].y)
  }
  ctx.stroke()
}

function redraw() {
  clearCanvas()
  for (const stroke of strokes.value) drawStroke(stroke)
  if (currentStroke) drawStroke(currentStroke)
}

function getPoint(event: PointerEvent): Point {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function onPointerDown(event: PointerEvent) {
  closeMenus()
  if (isFullscreen.value && panelOpen.value) closePanel()
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.setPointerCapture(event.pointerId)
  drawing = true
  currentStroke = {
    color: color.value,
    size: size.value,
    points: [getPoint(event)],
  }
  redraw()
}

function onPointerMove(event: PointerEvent) {
  if (!drawing || !currentStroke) return
  currentStroke.points.push(getPoint(event))
  redraw()
}

function onPointerUp(event: PointerEvent) {
  if (!drawing) return
  drawing = false
  const canvas = canvasRef.value
  try {
    canvas?.releasePointerCapture(event.pointerId)
  } catch {
    // ignore
  }
  if (currentStroke && currentStroke.points.length) {
    strokes.value.push(currentStroke)
  }
  currentStroke = null
  redraw()
}

function undo() {
  closeMenus()
  if (!strokes.value.length) return
  strokes.value.pop()
  redraw()
}

function clearAll() {
  closeMenus()
  strokes.value = []
  currentStroke = null
  redraw()
}

function canvasToBlob(): Promise<Blob> {
  const canvas = canvasRef.value
  if (!canvas) return Promise.reject(new Error('no canvas'))
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob failed'))
      },
      'image/png',
      1,
    )
  })
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function saveImage() {
  if (!strokes.value.length || saving.value) return
  saving.value = true
  try {
    const blob = await canvasToBlob()
    const filename = `画画_${Date.now()}.png`
    const file = new File([blob], filename, { type: 'image/png' })

    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean
      share?: (data: ShareData) => Promise<void>
    }

    if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
      try {
        await nav.share({
          files: [file],
          title: '我的画画',
          text: '保存我的画作',
        })
        showToast('已打开分享，可存到相册')
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
      }
    }

    downloadBlob(blob, filename)
    showToast('图片已保存，请到相册或下载里查看')
  } catch {
    showToast('保存失败，请再试一次')
  } finally {
    saving.value = false
  }
}

function onDocClick() {
  closeMenus()
  if (isFullscreen.value && panelOpen.value) closePanel()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (confirmVisible.value) {
      closeConfirm()
      return
    }
    if (openMenu.value) {
      closeMenus()
      return
    }
    if (isFullscreen.value && panelOpen.value) {
      closePanel()
      return
    }
    if (isFullscreen.value) {
      exitFullscreen()
      void nextTick().then(() => resizeCanvas())
    }
  }
}

onMounted(async () => {
  await nextTick()
  resizeCanvas()
  if (stageRef.value) {
    resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(stageRef.value)
  }
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  if (toastTimer) clearTimeout(toastTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
  exitFullscreen()
})
</script>
