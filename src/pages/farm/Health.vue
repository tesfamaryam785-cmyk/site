<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { HeartPulse, Syringe, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const selectedFlockId = ref('unit-flock-a')
const recordType = ref<'vaccination' | 'medication'>('vaccination')
const healthName = ref('Newcastle Disease Booster (LaSota)')
const doseStr = ref('1 vial / 1000 doses in drinking water')
const costAmount = ref(25.00)
const nextDueDate = ref('2026-08-15')
const recordDate = ref(new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const flockOptions = computed(() => {
  return farmStore.units.map(u => ({
    label: u.label,
    value: u.id
  }))
})

const upcomingVaccinations = computed(() => {
  return farmStore.healthRecords.filter(h => h.nextDueDate)
})

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitHealthRecord() {
  if (!healthName.value) {
    toast.error('Validation Error', 'Please enter vaccine or medication name.')
    return
  }

  isSubmitting.value = true
  try {
    await farmStore.addHealthRecord({
      farmUnitId: selectedFlockId.value,
      recordType: recordType.value,
      name: healthName.value,
      dose: doseStr.value,
      cost: costAmount.value,
      nextDueDate: recordType.value === 'vaccination' ? nextDueDate.value : undefined,
      recordedAt: recordDate.value
    })
    toast.success(
      'Health Log Saved',
      `Recorded ${recordType.value} for ${healthName.value}.`
    )
  } catch (e) {
    toast.error('Error', 'Failed to save health record.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <HeartPulse class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        Flock Health & Vaccination Protocol
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
        Log vaccinations, veterinary treatments, and schedule upcoming health boosters.
      </p>
    </div>

    <!-- Prominent Upcoming / Overdue Health Alerts Banner -->
    <div class="space-y-3">
      <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <Calendar class="w-5 h-5 text-amber-500" />
        Upcoming & Scheduled Vaccination Schedule
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="item in upcomingVaccinations"
          :key="item.id"
          class="p-4 rounded-xl border-l-4 border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/30 border border-stone-200 dark:border-stone-800 flex items-start justify-between"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Syringe class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 class="font-bold text-stone-900 dark:text-stone-100 text-base">
                {{ item.name }}
              </h3>
            </div>
            <p class="text-sm text-stone-700 dark:text-stone-300">
              Dose: {{ item.dose }}
            </p>
            <p class="text-xs text-stone-500 dark:text-stone-400">
              Last Given: {{ item.recordedAt }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-1">
            <BaseBadge variant="warning">
              Due: {{ item.nextDueDate }}
            </BaseBadge>
          </div>
        </div>
      </div>
    </div>

    <!-- Entry Form Card -->
    <BaseCard highlighted highlight-variant="primary">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
            Log Treatment or Vaccination
          </h2>
          <!-- Type Segmented Toggle -->
          <div class="inline-flex rounded-xl bg-stone-200 dark:bg-stone-800 p-1">
            <button
              type="button"
              @click="recordType = 'vaccination'"
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              :class="recordType === 'vaccination' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              Vaccination
            </button>
            <button
              type="button"
              @click="recordType = 'medication'"
              class="px-4 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              :class="recordType === 'medication' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              Medication
            </button>
          </div>
        </div>
      </template>

      <form @submit.prevent="submitHealthRecord" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="selectedFlockId"
            label="Target Flock"
            :options="flockOptions"
            required
          />

          <BaseInput
            v-model="healthName"
            :label="recordType === 'vaccination' ? 'Vaccine Name' : 'Medication / Vitamin Name'"
            placeholder="e.g. Newcastle LaSota, Multivitamins"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseInput
            v-model="doseStr"
            label="Dosage & Application"
            placeholder="e.g. 1 vial per 1000L water"
            required
          />

          <BaseInput
            v-model.number="costAmount"
            type="number"
            step="1"
            label="Treatment Cost (Birr)"
            required
          />

          <BaseInput
            v-model="recordDate"
            type="date"
            label="Date Administered"
            required
          />
        </div>

        <div v-if="recordType === 'vaccination'" class="w-full">
          <BaseInput
            v-model="nextDueDate"
            type="date"
            label="Next Booster Due Date"
            hint="Schedules automatic warning alert for upcoming booster"
          />
        </div>

        <div class="pt-3 flex justify-end">
          <BaseButton variant="primary" type="submit" size="lg" :loading="isSubmitting">
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Save Health Log
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- History List Card -->
    <BaseCard>
      <template #header>
        <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <ShieldCheck class="w-5 h-5 text-primary-600" />
          Health & Treatment Log History
        </h2>
      </template>

      <div class="divide-y divide-stone-100 dark:divide-stone-800">
        <div
          v-for="rec in farmStore.healthRecords"
          :key="rec.id"
          class="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2"
        >
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {{ rec.name }}
              </span>
              <BaseBadge :variant="rec.recordType === 'vaccination' ? 'active' : 'info'">
                {{ rec.recordType }}
              </BaseBadge>
            </div>
            <p class="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
              Dose: {{ rec.dose }} • Cost: {{ rec.cost.toFixed(2) }} Birr
            </p>
          </div>

          <div class="text-sm text-stone-500 font-mono">
            Administered: {{ rec.recordedAt }}
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>
