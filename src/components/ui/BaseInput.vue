<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string | number
  label?: string
  id?: string
  type?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <label
      v-if="label"
      :for="inputId"
      class="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500 font-bold">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      @input="onInput"
      class="w-full px-4 py-3 min-h-[44px] text-base rounded-xl border transition-colors bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="[
        error
          ? 'border-danger-500 text-danger-600 focus:ring-danger-500 dark:border-danger-500'
          : 'border-stone-300 dark:border-stone-700'
      ]"
    />

    <p v-if="error" class="text-sm font-medium text-danger-500 flex items-center gap-1 mt-0.5">
      <span>⚠️</span> {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
      {{ hint }}
    </p>
  </div>
</template>
