<template>
  <div class="home-page">
    <img class="home-page__avatar" :src="pageConfig.avatar" alt="头像" />
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
      <RouterLink
        v-for="(item, i) in menus"
        :key="item.key"
        :to="item.to"
        class="home-page__card"
        :style="{ animationDelay: `${0.08 + i * 0.08}s` }"
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
      </RouterLink>
    </nav>

    <p class="home-page__footer">{{ pageConfig.footer }}</p>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getMonthAge, menus, pageConfig } from './config'
import './index.scss'

const monthAge = getMonthAge()
</script>
