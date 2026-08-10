<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'active' | 'success' | 'low-stock' | 'warning' | 'overdue' | 'danger' | 'info' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'active',
  size: 'md',
  dot: true
})

const badgeClasses = computed(() => {
  switch (props.variant) {
    case 'active':
    case 'success':
      return 'bg-primary-100 text-primary-900 border-primary-300 dark:bg-primary-950/80 dark:text-primary-200 dark:border-primary-800'
    case 'low-stock':
    case 'warning':
      return 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800'
    case 'overdue':
    case 'danger':
      return 'bg-red-100 text-red-950 border-red-300 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800'
    case 'info':
      return 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800'
    case 'neutral':
    default:
      return 'bg-stone-200 text-stone-900 border-stone-300 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'
  }
})

const dotClasses = computed(() => {
  switch (props.variant) {
    case 'active':
    case 'success':
      return 'bg-primary-600'
    case 'low-stock':
    case 'warning':
      return 'bg-amber-600'
    case 'overdue':
    case 'danger':
      return 'bg-danger-500'
    case 'info':
      return 'bg-sky-600'
    case 'neutral':
    default:
      return 'bg-stone-500'
  }
})

const sizeClasses = computed(() => {
  return props.size === 'sm'
    ? 'px-2.5 py-0.5 text-xs font-bold'
    : 'px-3 py-1 text-sm font-bold'
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border shadow-2xs font-semibold tracking-wide"
    :class="[badgeClasses, sizeClasses]"
  >
    <span v-if="dot" class="w-2 h-2 rounded-full shrink-0" :class="dotClasses"></span>
    <slot />
  </span>
</template>
