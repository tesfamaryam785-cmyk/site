<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import { Egg, CheckCircle2, History } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const selectedFlockId = ref('unit-flock-a')
const recordType = ref('egg_count')
const valueCount = ref(450)
const recordDate = ref(new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const flockOptions = computed(() => {
  return farmStore.units.map(u => ({
    label: `${u.label} (${u.species.replace('_', ' ')})`,
    value: u.id
  }))
})

const recordTypeOptions = [
  { label: 'Egg Count (Eggs Collected)', value: 'egg_count' },
  { label: 'Milk Volume (Liters - Coming Soon)', value: 'milk_liters', disabled: true }
]

const recentRecords = computed(() => {
  return farmStore.productionRecords
    .filter(p => p.farmUnitId === selectedFlockId.value)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
})

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitProduction() {
  if (valueCount.value <= 0) {
    toast.error('Invalid Quantity', 'Please enter a production count greater than 0.')
    return
  }

  isSubmitting.value = true
  try {
    await farmStore.addProductionRecord({
      farmUnitId: selectedFlockId.value,
      recordType: recordType.value,
      value: valueCount.value,
      unit: 'eggs',
      recordedAt: recordDate.value
    })
    toast.success('Production Recorded!', `Logged ${valueCount.value} eggs for ${recordDate.value}.`)
  } catch (e) {
    toast.error('Error', 'Failed to save production record.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <Egg class="w-6 h-6 text-amber-600 dark:text-amber-400" />
        Daily Production Logging
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
        Quick one-handed field entry for egg collections and yield output.
      </p>
    </div>

    <!-- Entry Form Card -->
    <BaseCard highlighted highlight-variant="primary">
      <template #header>
        <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
          New Production Log Entry
        </h2>
      </template>

      <form @submit.prevent="submitProduction" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="selectedFlockId"
            label="Target Flock"
            :options="flockOptions"
            required
          />

          <BaseSelect
            v-model="recordType"
            label="Production Metric"
            :options="recordTypeOptions"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseNumberInput
            v-model="valueCount"
            label="Quantity Collected (Eggs)"
            :min="1"
            :step="10"
            required
          />

          <BaseInput
            v-model="recordDate"
            type="date"
            label="Date Collected"
            required
          />
        </div>

        <div class="pt-3 flex justify-end">
          <BaseButton variant="primary" type="submit" size="lg" :loading="isSubmitting">
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Save Production Log
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- Recent History Table Card -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold font-heading flex items-center gap-2">
            <History class="w-5 h-5 text-stone-500" />
            Recent Production Log History
          </h2>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {{ recentRecords.length }} Records
          </span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-sm font-semibold">
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Metric</th>
              <th class="py-3 px-4">Value</th>
              <th class="py-3 px-4">Trays Equivalent</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800/60 text-stone-800 dark:text-stone-200 text-base">
            <tr v-for="rec in recentRecords" :key="rec.id" class="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
              <td class="py-3 px-4 font-mono font-medium">{{ rec.recordedAt }}</td>
              <td class="py-3 px-4 font-medium uppercase text-sm text-stone-600 dark:text-stone-400">
                {{ rec.recordType.replace('_', ' ') }}
              </td>
              <td class="py-3 px-4 font-extrabold text-primary-600 dark:text-primary-400 font-heading">
                {{ rec.value.toLocaleString() }} {{ rec.unit }}
              </td>
              <td class="py-3 px-4 font-mono text-sm text-stone-600 dark:text-stone-400">
                ~{{ (rec.value / 30).toFixed(1) }} trays
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
