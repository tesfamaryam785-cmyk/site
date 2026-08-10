<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  highlighted?: boolean
  highlightVariant?: 'primary' | 'accent'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  highlighted: false,
  highlightVariant: 'primary',
  padding: 'md'
})

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-4'
    case 'lg':
      return 'p-8'
    case 'md':
    default:
      return 'p-6'
  }
})

const cardClasses = computed(() => {
  if (props.highlighted) {
    return props.highlightVariant === 'accent'
      ? 'border-2 border-accent-500 bg-accent-50/40 dark:bg-accent-950/20 shadow-md ring-1 ring-accent-500/20'
      : 'border-2 border-primary-500 bg-primary-50/40 dark:bg-primary-950/20 shadow-md ring-1 ring-primary-500/20'
  }
  return 'border border-stone-200 dark:border-stone-800 bg-card-light dark:bg-card-dark shadow-xs'
})
</script>

<template>
  <div
    class="rounded-xl transition-all duration-200"
    :class="[cardClasses, paddingClasses]"
  >
    <div v-if="$slots.header" class="mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
      <slot name="header" />
    </div>

    <div>
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800">
      <slot name="footer" />
    </div>
  </div>
</template>
