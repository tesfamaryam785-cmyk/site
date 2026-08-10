<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import { Wheat, CheckCircle2, History } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const selectedFlockId = ref('unit-flock-a')
const feedType = ref('Layer Mash High Protein')
const quantityKg = ref(60)
const costAmount = ref(36.00)
const recordDate = ref(new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const flockOptions = computed(() => {
  return farmStore.units.map(u => ({
    label: u.label,
    value: u.id
  }))
})

const feedTypeOptions = [
  { label: 'Noug Seed Cake & Layer Mash Blend', value: 'Noug Seed Cake Blend' },
  { label: 'Wheat Bran & Maize Mash Mix', value: 'Wheat Bran & Maize Mash' },
  { label: 'Akaki Bishoftu Layer Mash (20% CP)', value: 'Akaki Layer Mash' },
  { label: 'Broiler Finisher Pellets (Akaki)', value: 'Broiler Finisher Pellets' },
  { label: 'Chick Starter Crumbles (Fortified)', value: 'Chick Starter Crumbles' }
]

const recentFeedRecords = computed(() => {
  return farmStore.feedRecords
    .filter(f => f.farmUnitId === selectedFlockId.value)
    .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
})

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitFeedLog() {
  isSubmitting.value = true
  try {
    await farmStore.addFeedRecord({
      farmUnitId: selectedFlockId.value,
      feedType: feedType.value,
      quantityKg: quantityKg.value,
      cost: costAmount.value,
      recordedAt: recordDate.value
    })
    toast.success('Feed Logged', `Logged ${quantityKg.value}kg (${feedType.value}) for ${recordDate.value}.`)
  } catch (e) {
    toast.error('Error', 'Failed to save feed log.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <Wheat class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        Daily Feed Consumption & Inventory
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
        Track feed ration usage (kg) and feed expenses for flock nutrition management.
      </p>
    </div>

    <!-- Entry Form Card -->
    <BaseCard highlighted highlight-variant="primary">
      <template #header>
        <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
          New Feed Ration Entry
        </h2>
      </template>

      <form @submit.prevent="submitFeedLog" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="selectedFlockId"
            label="Target Flock"
            :options="flockOptions"
            required
          />

          <BaseSelect
            v-model="feedType"
            label="Feed Type / Brand"
            :options="feedTypeOptions"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseNumberInput
            v-model="quantityKg"
            label="Quantity Fed (kg)"
            :min="1"
            :step="5"
            required
          />

          <BaseInput
            v-model.number="costAmount"
            type="number"
            step="0.5"
            label="Estimated Cost (Birr)"
            required
          />

          <BaseInput
            v-model="recordDate"
            type="date"
            label="Date Fed"
            required
          />
        </div>

        <div class="pt-3 flex justify-end">
          <BaseButton variant="primary" type="submit" size="lg" :loading="isSubmitting">
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Save Feed Log
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
            Feed Log History
          </h2>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {{ recentFeedRecords.length }} Logs
          </span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr class="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-sm font-semibold">
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Feed Brand / Type</th>
              <th class="py-3 px-4">Quantity (kg)</th>
              <th class="py-3 px-4">Total Cost (Birr)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800/60 text-stone-800 dark:text-stone-200 text-base">
            <tr v-for="rec in farmStore.feedRecords" :key="rec.id" class="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
              <td class="py-3 px-4 font-mono font-medium text-sm">{{ rec.recordedAt }}</td>
              <td class="py-3 px-4 font-bold text-stone-900 dark:text-stone-100">{{ rec.feedType }}</td>
              <td class="py-3 px-4 font-semibold text-primary-600 dark:text-primary-400">{{ rec.quantityKg }} kg</td>
              <td class="py-3 px-4 font-mono font-medium text-stone-700 dark:text-stone-300">
                {{ rec.cost.toFixed(2) }} Birr
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
