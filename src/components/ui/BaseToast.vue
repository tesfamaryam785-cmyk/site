<script setup lang="ts">
import { useToastStore, type ToastItem } from '@/stores/toast'

const toastStore = useToastStore()

function getToastClasses(type: ToastItem['type']) {
  switch (type) {
    case 'success':
      return 'bg-primary-500 text-white border-primary-600 shadow-lg'
    case 'error':
      return 'bg-danger-500 text-white border-danger-600 shadow-lg'
    case 'warning':
      return 'bg-amber-500 text-white border-amber-600 shadow-lg'
    case 'info':
    default:
      return 'bg-stone-900 text-white border-stone-800 shadow-lg dark:bg-stone-100 dark:text-stone-900'
  }
}

function getIcon(type: ToastItem['type']) {
  switch (type) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '⚠️'
    case 'info':
    default:
      return 'ℹ️'
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-x-4 scale-95"
      >
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start justify-between p-4 rounded-xl border font-sans"
          :class="getToastClasses(toast.type)"
          role="alert"
        >
          <div class="flex items-start gap-3">
            <span class="text-xl shrink-0 leading-none mt-0.5">{{ getIcon(toast.type) }}</span>
            <div class="flex flex-col">
              <h4 class="font-bold text-base leading-tight">{{ toast.title }}</h4>
              <p v-if="toast.message" class="text-sm opacity-90 mt-1">{{ toast.message }}</p>
            </div>
          </div>

          <button
            type="button"
            @click="toastStore.removeToast(toast.id)"
            class="ml-3 text-current opacity-70 hover:opacity-100 transition-opacity p-1 cursor-pointer"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
