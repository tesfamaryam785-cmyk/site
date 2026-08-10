<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'card' | 'circle' | 'button'
  height?: string
  width?: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  count: 1
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'circle':
      return 'rounded-full w-12 h-12'
    case 'card':
      return 'rounded-xl h-40 w-full'
    case 'button':
      return 'rounded-xl h-11 w-28'
    case 'text':
    default:
      return 'rounded-md h-5 w-full'
  }
})
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse bg-stone-200 dark:bg-stone-800 relative overflow-hidden"
      :class="variantClasses"
      :style="{
        height: height || undefined,
        width: width || undefined
      }"
    >
      <div class="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"></div>
    </div>
  </div>
</template>
