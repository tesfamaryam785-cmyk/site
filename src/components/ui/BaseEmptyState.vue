<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { Inbox } from 'lucide-vue-next'

interface Props {
  title?: string
  message?: string
  actionLabel?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'action'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
    <div class="w-16 h-16 rounded-2xl bg-stone-200/70 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center mb-4">
      <slot name="icon">
        <Inbox class="w-8 h-8" />
      </slot>
    </div>

    <h3 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 mb-1">
      <slot name="title">{{ title || 'No Data Found' }}</slot>
    </h3>

    <p class="text-stone-600 dark:text-stone-400 text-base max-w-md mb-6">
      <slot name="message">{{ message || 'There are currently no items to display in this list.' }}</slot>
    </p>

    <BaseButton v-if="actionLabel || $slots.action" variant="primary" @click="emit('action')">
      <slot name="action">{{ actionLabel }}</slot>
    </BaseButton>
  </div>
</template>
