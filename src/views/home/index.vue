<template>
  <div class="home-page">
    <button
      class="home-page__avatar-btn"
      type="button"
      aria-label="查看头像大图"
      @click="openAvatar"
    >
      <img class="home-page__avatar" :src="pageConfig.avatar" alt="头像" />
    </button>
    <div class="home-page__age" aria-label="宝宝月龄">
      <span class="home-page__age-num">{{ monthAge }}</span>
      <span class="home-page__age-unit">
        <em>月龄</em>
        <small>个月</small>
      </span>
    </div>

    <div class="home-page__blob home-page__blob--a" aria-hidden="true" />
    <div class="home-page__blob home-page__blob--b" aria-hidden="true" />
    <div class="home-page__blob home-page__blob--c" aria-hidden="true" />

    <header class="home-page__hero">
      <h1 class="home-page__brand">{{ pageConfig.brand }}</h1>
      <p class="home-page__tagline">{{ pageConfig.tagline }}</p>
    </header>

    <nav class="home-page__menu" aria-label="功能菜单">
      <button
        v-for="(item, i) in menus"
        :key="item.key"
        class="home-page__card"
        type="button"
        :style="{ animationDelay: `${0.08 + i * 0.08}s` }"
        @click="onCardClick($event, item)"
      >
        <span
          class="home-page__icon"
          :style="{ backgroundImage: `linear-gradient(145deg, ${item.from}, ${item.toColor})` }"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24">
            <path :d="item.icon" />
          </svg>
        </span>
        <span class="home-page__label">{{ item.name }}</span>
        <span class="home-page__hint">{{ item.hint }}</span>
      </button>
    </nav>

    <p class="home-page__footer">{{ pageConfig.footer }}</p>

    <Teleport to="body">
      <div
        v-if="avatarPreview"
        class="home-page__preview"
        role="dialog"
        aria-modal="true"
        aria-label="头像大图"
        @click="closeAvatar"
      >
        <img
          class="home-page__preview-img"
          :src="pageConfig.avatar"
          alt="头像大图"
          @click.stop
        />
        <button class="home-page__preview-close" type="button" aria-label="关闭" @click="closeAvatar">
          关闭
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getMonthAge, menus, pageConfig, type MenuItem } from './config'
import './index.scss'

const router = useRouter()
const monthAge = getMonthAge()
const avatarPreview = ref(false)

function openAvatar() {
  avatarPreview.value = true
  document.body.style.overflow = 'hidden'
}

function closeAvatar() {
  avatarPreview.value = false
  document.body.style.overflow = ''
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && avatarPreview.value) closeAvatar()
}

window.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (avatarPreview.value) document.body.style.overflow = ''
})

function spawnRipple(event: MouseEvent, card: HTMLElement, color: string) {
  const rect = card.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 1.25
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'home-page__ripple'
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.setProperty('--ripple-color', color)
  card.appendChild(ripple)
  window.setTimeout(() => ripple.remove(), 650)
}

function onCardClick(event: MouseEvent, item: MenuItem) {
  const card = event.currentTarget as HTMLElement
  spawnRipple(event, card, item.toColor)
  window.setTimeout(() => {
    void router.push({ name: item.routeName }).catch(() => router.push(item.to))
  }, 120)
}
</script>
