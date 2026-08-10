<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: number
  label?: string
  id?: string
  min?: number
  max?: number
  step?: number
  unit?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  min: 0,
  step: 1,
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const inputId = computed(() => props.id || `num-input-${Math.random().toString(36).substring(2, 9)}`)

function updateValue(newValue: number) {
  let clamped = newValue
  if (props.min !== undefined && clamped < props.min) clamped = props.min
  if (props.max !== undefined && clamped > props.max) clamped = props.max
  emit('update:modelValue', clamped)
}

function increment() {
  if (props.disabled) return
  updateValue((props.modelValue ?? 0) + props.step)
}

function decrement() {
  if (props.disabled) return
  updateValue((props.modelValue ?? 0) - props.step)
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    updateValue(parsed)
  }
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
      <span v-if="unit" class="text-stone-500 font-normal text-sm">({{ unit }})</span>
      <span v-if="required" class="text-danger-500 font-bold">*</span>
    </label>

    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="decrement"
        :disabled="disabled || (min !== undefined && modelValue <= min)"
        class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-extrabold text-2xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed select-none touch-manipulation cursor-pointer"
        aria-label="Decrement value"
      >
        −
      </button>

      <div class="relative flex-1">
        <input
          :id="inputId"
          type="number"
          :value="modelValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          @input="onInput"
          class="w-full px-4 py-3 min-h-[44px] text-center font-mono font-bold text-lg rounded-xl border transition-colors bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:opacity-50 disabled:cursor-not-allowed border-stone-300 dark:border-stone-700"
          :class="[error ? 'border-danger-500 dark:border-danger-500' : '']"
        />
      </div>

      <button
        type="button"
        @click="increment"
        :disabled="disabled || (max !== undefined && modelValue >= max)"
        class="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 text-white font-extrabold text-2xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed select-none touch-manipulation cursor-pointer"
        aria-label="Increment value"
      >
        +
      </button>
    </div>

    <p v-if="error" class="text-sm font-medium text-danger-500 flex items-center gap-1 mt-0.5">
      <span>⚠️</span> {{ error }}
    </p>
    <p v-else-if="hint" class="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
      {{ hint }}
    </p>
  </div>
</template>
