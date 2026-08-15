<template>
  <div class="tag-select" :class="{ open }">
    <button
      class="tag-select__trigger"
      type="button"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="tag-select__label">{{ label }}</span>
      <span class="tag-select__value">{{ displayText }}</span>
      <span class="tag-select__chevron" aria-hidden="true" />
    </button>

    <Teleport to="body">
      <Transition name="tag-select-fade">
        <div v-if="open" class="tag-select__mask" @click="close" />
      </Transition>
      <Transition name="tag-select-sheet">
        <div
          v-if="open"
          class="tag-select__sheet"
          role="listbox"
          :aria-label="label"
          @click.stop
        >
          <div class="tag-select__handle" aria-hidden="true" />
          <div class="tag-select__sheet-head">
            <h3 class="tag-select__sheet-title">选择标签</h3>
            <button class="tag-select__close" type="button" aria-label="关闭" @click="close">
              完成
            </button>
          </div>
          <div class="tag-select__options">
            <button
              v-for="item in items"
              :key="item.value || '__all__'"
              class="tag-select__option"
              type="button"
              role="option"
              :aria-selected="modelValue === item.value"
              :class="{ active: modelValue === item.value }"
              @click="pick(item.value)"
            >
              <span class="tag-select__option-text">{{ item.label }}</span>
              <span class="tag-select__option-right">
                <span class="tag-select__option-count">{{ item.count }}</span>
                <span v-if="modelValue === item.value" class="tag-select__check" aria-hidden="true">
                  ✓
                </span>
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gushiData } from '../config'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: string[]
    label?: string
    allLabel?: string
  }>(),
  {
    label: '标签',
    allLabel: '全部标签',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)

const totalCount = gushiData.stories.length

const tagCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const story of gushiData.stories) {
    counts.set(story.tag, (counts.get(story.tag) ?? 0) + 1)
  }
  return counts
})

const items = computed(() => [
  { value: '', label: props.allLabel, count: `${totalCount}篇` },
  ...props.options.map((tag) => ({
    value: tag,
    label: tag,
    count: `${tagCounts.value.get(tag) ?? 0}篇`,
  })),
])

const displayText = computed(() => {
  if (!props.modelValue) return props.allLabel
  return props.modelValue
})

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function pick(value: string) {
  emit('update:modelValue', value)
  close()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) close()
}

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
.tag-select {
  flex: 1;
  min-width: 0;

  &__trigger {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border-radius: 12px;
    border: 1px solid rgba(95, 125, 144, 0.16);
    background: rgba(255, 255, 255, 0.78);
    box-shadow: 0 4px 12px rgba(31, 58, 77, 0.04);
    color: #1f3a4d;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.985);
    }
  }

  &.open &__trigger {
    border-color: rgba(94, 179, 212, 0.55);
    box-shadow: 0 0 0 3px rgba(159, 216, 240, 0.35);
  }

  &__label {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    color: #5f7d90;
  }

  &__value {
    flex: 1;
    min-width: 0;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__chevron {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-right: 2px solid #5f7d90;
    border-bottom: 2px solid #5f7d90;
    transform: rotate(45deg) translateY(-2px);
    transition: transform 0.2s ease;
    opacity: 0.75;
  }

  &.open &__chevron {
    transform: rotate(225deg) translateY(-2px);
  }
}

.tag-select__mask {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(31, 58, 77, 0.38);
  backdrop-filter: blur(2px);
}

.tag-select__sheet {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 90;
  width: min(100%, 480px);
  transform: translateX(-50%);
  max-height: min(68vh, 520px);
  display: flex;
  flex-direction: column;
  padding: 8px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  border-radius: 22px 22px 0 0;
  background:
    radial-gradient(ellipse 80% 50% at 100% 0%, #fff6e4 0%, transparent 55%),
    linear-gradient(180deg, #eaf6fb 0%, #ffffff 40%);
  box-shadow: 0 -12px 36px rgba(31, 58, 77, 0.16);
}

.tag-select__handle {
  width: 40px;
  height: 4px;
  margin: 4px auto 10px;
  border-radius: 999px;
  background: rgba(95, 125, 144, 0.28);
}

.tag-select__sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tag-select__sheet-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f3a4d;
}

.tag-select__close {
  border: none;
  background: transparent;
  color: #2f6f8a;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 4px;
  cursor: pointer;
}

.tag-select__options {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0 8px;
}

.tag-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid rgba(95, 125, 144, 0.14);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  color: #1f3a4d;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    transform 0.12s ease;

  &:active {
    transform: scale(0.985);
  }

  &.active {
    border-color: transparent;
    background: linear-gradient(135deg, #5eb3d4, #3f97b8);
    color: #fff;
    box-shadow: 0 8px 18px rgba(63, 151, 184, 0.28);
  }
}

.tag-select__option-text {
  min-width: 0;
}

.tag-select__option-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.tag-select__option-count {
  font-size: 12px;
  font-weight: 600;
  color: #8aa0ad;
}

.tag-select__option.active .tag-select__option-count {
  color: rgba(255, 255, 255, 0.86);
}

.tag-select__check {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
}

.tag-select-fade-enter-active,
.tag-select-fade-leave-active {
  transition: opacity 0.2s ease;
}

.tag-select-fade-enter-from,
.tag-select-fade-leave-to {
  opacity: 0;
}

.tag-select-sheet-enter-active,
.tag-select-sheet-leave-active {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.tag-select-sheet-enter-from,
.tag-select-sheet-leave-to {
  transform: translate(-50%, 110%);
}
</style>
