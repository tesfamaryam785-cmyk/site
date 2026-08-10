<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { Plus, Tractor, Calendar, Users, Activity } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const newFlock = ref({
  label: '',
  species: 'layer_chicken',
  quantity: 100,
  startDate: new Date().toISOString().split('T')[0]
})

const speciesOptions = [
  { label: 'Bovans Brown (High-Yield Layer)', value: 'Bovans Brown' },
  { label: 'Sasso T44 (Dual-Purpose Scavenger)', value: 'Sasso T44' },
  { label: 'Potchefstroom Koekoek (Dual-Purpose)', value: 'Potchefstroom Koekoek' },
  { label: 'Broiler (Cobb 500)', value: 'Cobb 500 Broiler' },
  { label: 'Local Habesha / Indigenous Breed', value: 'Local Habesha' },
  { label: 'Dairy Cattle (Coming Soon)', value: 'dairy_cow', disabled: true },
  { label: 'Goats & Livestock (Coming Soon)', value: 'livestock', disabled: true }
]

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitAddFlock() {
  if (!newFlock.value.label) {
    toast.error('Validation Error', 'Please enter a label for the flock.')
    return
  }
  isSubmitting.value = true
  try {
    await farmStore.addFarmUnit({
      farmId: farmStore.farm?.id || 'farm-1',
      unitType: 'poultry_flock',
      species: newFlock.value.species,
      label: newFlock.value.label,
      quantity: newFlock.value.quantity,
      startDate: newFlock.value.startDate,
      status: 'active'
    })
    toast.success('Flock Added', `Successfully registered ${newFlock.value.label}.`)
    isModalOpen.value = false
    newFlock.value = {
      label: '',
      species: 'layer_chicken',
      quantity: 100,
      startDate: new Date().toISOString().split('T')[0]
    }
  } catch (e) {
    toast.error('Error', 'Failed to add flock.')
  } finally {
    isSubmitting.value = false
  }
}

function calculateDaysActive(startDateStr: string) {
  const start = new Date(startDateStr).getTime()
  const now = new Date().getTime()
  const diffDays = Math.floor((now - start) / (1000 * 3600 * 24))
  return diffDays > 0 ? diffDays : 1
}
</script>

<template>
  <div class="space-y-8 md:space-y-10">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
          Flocks & Livestock Units
        </h1>
        <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
          Active animal units and flock inventory on {{ farmStore.farm?.name || 'Green Valley Farm' }}.
        </p>
      </div>

      <BaseButton variant="primary" @click="isModalOpen = true">
        <Plus class="w-5 h-5 mr-2" />
        Add Flock / Herd
      </BaseButton>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="farmStore.loading && !farmStore.isLoaded" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonLoader variant="card" :count="2" />
    </div>

    <!-- Flock Card Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BaseCard
        v-for="unit in farmStore.units"
        :key="unit.id"
        highlighted
        :highlight-variant="unit.species === 'layer_chicken' ? 'primary' : 'accent'"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Tractor class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              {{ unit.label }}
            </h3>
            <BaseBadge :variant="unit.status === 'active' ? 'active' : 'neutral'">
              {{ unit.status }}
            </BaseBadge>
          </div>
        </template>

        <div class="space-y-3 py-1">
          <div class="flex items-center justify-between text-base">
            <span class="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <Users class="w-4 h-4 text-stone-500" /> Species / Variety
            </span>
            <span class="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide text-sm">
              {{ unit.species.replace('_', ' ') }}
            </span>
          </div>

          <div class="flex items-center justify-between text-base">
            <span class="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <Activity class="w-4 h-4 text-stone-500" /> Current Count
            </span>
            <span class="font-extrabold text-2xl text-primary-600 dark:text-primary-400 font-heading">
              {{ unit.quantity.toLocaleString() }} <span class="text-xs font-normal text-stone-500">birds</span>
            </span>
          </div>

          <div class="flex items-center justify-between text-base">
            <span class="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-stone-500" /> Days Active
            </span>
            <span class="font-bold text-stone-800 dark:text-stone-200">
              {{ calculateDaysActive(unit.startDate) }} days
            </span>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Add Flock Modal -->
    <BaseModal
      :show="isModalOpen"
      title="Add New Flock / Livestock Unit"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="submitAddFlock" class="space-y-4">
        <BaseInput
          v-model="newFlock.label"
          label="Flock Label / Identification"
          placeholder="e.g. Flock C - Layers"
          required
        />

        <BaseSelect
          v-model="newFlock.species"
          label="Species / Livestock Type"
          :options="speciesOptions"
          required
        />

        <BaseNumberInput
          v-model="newFlock.quantity"
          label="Initial Head Count / Birds"
          :min="1"
          :step="10"
          required
        />

        <BaseInput
          v-model="newFlock.startDate"
          type="date"
          label="Start / Placement Date"
          required
        />

        <div class="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
          <BaseButton variant="ghost" type="button" @click="isModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton variant="primary" type="submit" :loading="isSubmitting">
            Save Flock
          </BaseButton>
        </div>
      </form>
    </BaseModal>
  </div>
</template>
