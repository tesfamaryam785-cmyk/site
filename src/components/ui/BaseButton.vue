<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-sm border border-transparent dark:bg-primary-500 dark:hover:bg-primary-600'
    case 'secondary':
      return 'bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 border border-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 dark:border-stone-700'
    case 'ghost':
      return 'bg-transparent hover:bg-stone-200/60 dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200 border border-transparent'
    case 'danger':
      return 'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 text-white shadow-sm border border-transparent dark:bg-danger-500 dark:hover:bg-danger-600'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'px-6 py-3.5 text-lg min-h-[52px]'
    case 'md':
    default:
      return 'px-5 py-3 text-base min-h-[44px]'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed select-none touch-manipulation cursor-pointer"
    :class="[variantClasses, sizeClasses]"
  >
    <template v-if="loading">
      <span class="inline-block w-4 h-4 mr-2.5 rounded-full border-2 border-current border-t-transparent animate-spin"></span>
      <slot name="loading">Loading...</slot>
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>
