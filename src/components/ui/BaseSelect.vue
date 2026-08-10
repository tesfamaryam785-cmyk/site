<script setup lang="ts">
import { computed } from 'vue'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  label?: string
  id?: string
  options?: SelectOption[]
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: 'Select an option...',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const selectId = computed(() => props.id || `select-${Math.random().toString(36).substring(2, 9)}`)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label
      v-if="label"
      :for="selectId"
      class="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 font-bold">*</span>
    </label>

    <div class="relative w-full">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @change="onChange"
        class="w-full px-4 py-3 min-h-[44px] text-base rounded-xl border transition-colors bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10 cursor-pointer"
        :class="[
          error
            ? 'border-danger-500 dark:border-danger-500'
            : 'border-stone-300 dark:border-stone-700'
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
          :disabled="opt.disabled"
        >
          {{ opt.label }}
        </option>
        <slot />
      </select>

      <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-stone-500 dark:text-stone-400">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    <p v-if="error" class="text-sm font-medium text-danger-500 flex items-center gap-1 mt-0.5">
      <span>⚠️</span> {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
      {{ hint }}
    </p>
  </div>
</template>
