<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from './BaseCard.vue'

interface Props {
  label: string
  value: string | number
  unit?: string
  trend?: {
    value: string | number
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  highlighted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlighted: false
})

const trendBadgeClasses = computed(() => {
  if (!props.trend) return ''
  switch (props.trend.direction) {
    case 'up':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300'
    case 'down':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    case 'neutral':
    default:
      return 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
  }
})

const trendIcon = computed(() => {
  if (!props.trend) return ''
  return props.trend.direction === 'up' ? '↑' : props.trend.direction === 'down' ? '↓' : '→'
})
</script>

<template>
  <BaseCard :highlighted="highlighted" padding="md">
    <div class="flex items-start justify-between">
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold tracking-wide text-stone-600 dark:text-stone-400 uppercase font-sans">
          {{ label }}
        </span>
        <div class="flex items-baseline gap-1 mt-1">
          <span class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
            {{ value }}
          </span>
          <span v-if="unit" class="text-base font-medium text-stone-500 dark:text-stone-400">
            {{ unit }}
          </span>
        </div>
      </div>

      <div
        v-if="$slots.icon"
        class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0"
      >
        <slot name="icon" />
      </div>
    </div>

    <div v-if="trend" class="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2">
      <span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold" :class="trendBadgeClasses">
        <span>{{ trendIcon }}</span>
        <span>{{ trend.value }}</span>
      </span>
      <span v-if="trend.label" class="text-xs text-stone-500 dark:text-stone-400">
        {{ trend.label }}
      </span>
    </div>
  </BaseCard>
</template>
