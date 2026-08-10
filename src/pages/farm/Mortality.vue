<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { AlertOctagon, CheckCircle2, History } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const selectedFlockId = ref('unit-flock-b')
const deathCount = ref(1)
const cause = ref('heat stress')
const customCause = ref('')
const recordDate = ref(new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const flockOptions = computed(() => {
  return farmStore.units.map(u => ({
    label: u.label,
    value: u.id
  }))
})

const causeOptions = [
  { label: 'Heat Stress / Dehydration', value: 'heat stress' },
  { label: 'Pecking Injury / Cannibalism', value: 'pecking injury' },
  { label: 'Respiratory Disease Symptoms', value: 'respiratory disease' },
  { label: 'Unknown Cause', value: 'unknown' },
  { label: 'Other (Specify below)', value: 'other' }
]

const recentMortalityRecords = computed(() => {
  return farmStore.mortalityRecords
    .filter(m => m.farmUnitId === selectedFlockId.value)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
})

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitMortalityLog() {
  const finalCause = cause.value === 'other' ? (customCause.value || 'other') : cause.value
  isSubmitting.value = true
  try {
    await farmStore.addMortalityRecord({
      farmUnitId: selectedFlockId.value,
      quantity: deathCount.value,
      cause: finalCause,
      recordedAt: recordDate.value
    })
    toast.warning('Mortality Logged', `Recorded ${deathCount.value} lost bird(s) due to ${finalCause}.`)
  } catch (e) {
    toast.error('Error', 'Failed to save mortality record.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <AlertOctagon class="w-6 h-6 text-danger-500" />
        Mortality & Loss Tracking
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
        Log bird mortality and cause analysis for herd health telemetry.
      </p>
    </div>

    <!-- Form -->
    <BaseCard highlighted highlight-variant="accent">
      <template #header>
        <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
          Log Mortality Event
        </h2>
      </template>

      <form @submit.prevent="submitMortalityLog" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="selectedFlockId"
            label="Affected Flock"
            :options="flockOptions"
            required
          />

          <BaseSelect
            v-model="cause"
            label="Observed Primary Cause"
            :options="causeOptions"
            required
          />
        </div>

        <div v-if="cause === 'other'" class="w-full">
          <BaseInput
            v-model="customCause"
            label="Specify Custom Cause"
            placeholder="e.g. Predator attack, ventilation failure"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseNumberInput
            v-model="deathCount"
            label="Quantity Lost"
            :min="1"
            :step="1"
            required
          />

          <BaseInput
            v-model="recordDate"
            type="date"
            label="Date of Event"
            required
          />
        </div>

        <div class="pt-3 flex justify-end">
          <BaseButton variant="danger" type="submit" size="lg" :loading="isSubmitting">
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Log Mortality Record
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- History Table -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold font-heading flex items-center gap-2">
            <History class="w-5 h-5 text-stone-500" />
            Recent Mortality Event History
          </h2>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {{ recentMortalityRecords.length }} Records
          </span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-sm font-semibold">
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Loss Count</th>
              <th class="py-3 px-4">Cause</th>
              <th class="py-3 px-4">Severity Weight</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800/60 text-stone-800 dark:text-stone-200 text-base">
            <tr v-for="rec in recentMortalityRecords" :key="rec.id" class="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
              <td class="py-3 px-4 font-mono font-medium">{{ rec.recordedAt }}</td>
              <td class="py-3 px-4 font-extrabold text-stone-900 dark:text-stone-100 font-heading">
                {{ rec.quantity }} bird(s)
              </td>
              <td class="py-3 px-4 font-medium text-stone-700 dark:text-stone-300 capitalize">
                {{ rec.cause }}
              </td>
              <td class="py-3 px-4">
                <BaseBadge :variant="rec.quantity > 1 ? 'danger' : 'warning'">
                  {{ rec.quantity > 1 ? 'High Loss Severity' : 'Routine Loss' }}
                </BaseBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
