<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFarmStore } from '@/stores/farmStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { Check, ArrowRight, ArrowLeft, Feather, Milk, Sprout, Tractor } from 'lucide-vue-next'

const farmStore = useFarmStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const currentStep = ref(1)
const isSubmitting = ref(false)

// Form Step 1: Farm Details
const farmName = ref('Bishoftu Layers Farm')
const farmLocation = ref('Bishoftu (Debre Zeit), Oromia Region')

// Form Step 2: Farm Type Selection
const selectedTypes = ref<string[]>(['poultry'])
const farmTypeOptions = [
  { id: 'poultry', name: 'Poultry & Fowl', desc: 'Bovans Brown, Sasso & Koekoek yield telemetry', active: true, icon: Feather },
  { id: 'dairy', name: 'Dairy Cattle', desc: 'Milk yield tracking and herd telemetry', active: false, comingSoon: true, icon: Milk },
  { id: 'livestock', name: 'Goats & Livestock', desc: 'Pasture rotational grazing and breeding', active: false, comingSoon: true, icon: Tractor },
  { id: 'crops', name: 'Crops & Horticulture', desc: 'Soil moisture, irrigation and harvest log', active: false, comingSoon: true, icon: Sprout }
]

// Form Step 3: First Flock Setup
const flockLabel = ref('Flock A - Bovans Brown Layers')
const flockSpecies = ref('Bovans Brown')
const flockQuantity = ref(500)
const flockStartDate = ref(new Date().toISOString().split('T')[0])

const speciesOptions = [
  { label: 'Bovans Brown (High-Yield Layer)', value: 'Bovans Brown' },
  { label: 'Sasso T44 (Dual-Purpose Scavenger)', value: 'Sasso T44' },
  { label: 'Potchefstroom Koekoek (Dual-Purpose)', value: 'Potchefstroom Koekoek' },
  { label: 'Cobb 500 Broiler', value: 'Cobb 500 Broiler' }
]

function nextStep() {
  if (currentStep.value === 1 && !farmName.value) {
    toast.error('Validation Error', 'Please enter your farm name.')
    return
  }
  currentStep.value++
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function finishSetup() {
  if (!flockLabel.value) {
    toast.error('Validation Error', 'Please enter a flock label.')
    return
  }

  isSubmitting.value = true
  try {
    await farmStore.addFarmUnit({
      farmId: 'farm-1',
      unitType: 'poultry_flock',
      species: flockSpecies.value,
      label: flockLabel.value,
      quantity: flockQuantity.value,
      startDate: flockStartDate.value,
      status: 'active'
    })

    authStore.isFarmSetupCompleted = true
    toast.success('Farm Setup Complete!', 'Your Bishoftu farm dashboard is ready.')
    router.push('/dashboard')
  } catch (e) {
    toast.error('Setup Error', 'Failed to complete farm setup.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseCard highlighted highlight-variant="primary" class="shadow-xl">
    <template #header>
      <div class="space-y-3">
        <!-- Stepper Indicator Header -->
        <div class="flex items-center justify-between px-2">
          <div
            v-for="s in [1, 2, 3]"
            :key="s"
            class="flex items-center gap-2"
          >
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all"
              :class="[
                currentStep === s
                  ? 'bg-primary-500 text-white shadow-xs'
                  : currentStep > s
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300'
                  : 'bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              ]"
            >
              <Check v-if="currentStep > s" class="w-5 h-5" />
              <span v-else>{{ s }}</span>
            </div>
            <span class="hidden sm:inline text-xs font-bold text-stone-600 dark:text-stone-400">
              {{ s === 1 ? 'Farm Info' : s === 2 ? 'Farm Type' : 'First Flock' }}
            </span>
          </div>
        </div>

        <div class="text-center pt-2">
          <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
            {{ currentStep === 1 ? 'Step 1: Farm Details' : currentStep === 2 ? 'Step 2: Select Farm Type' : 'Step 3: Add Your First Flock' }}
          </h1>
          <p class="text-stone-600 dark:text-stone-400 text-sm">
            {{ currentStep === 1 ? 'Identify your Ethiopian farm location & operator profile' : currentStep === 2 ? 'Choose active telemetry module for your operations' : 'Initialize your primary production unit' }}
          </p>
        </div>
      </div>
    </template>

    <!-- STEP 1: Farm Name & Location -->
    <div v-if="currentStep === 1" class="space-y-4 pt-2">
      <BaseInput
        v-model="farmName"
        label="Farm / Property Name"
        placeholder="e.g. Bishoftu Layers Farm"
        required
      />

      <BaseInput
        v-model="farmLocation"
        label="Location / Region"
        placeholder="e.g. Bishoftu (Debre Zeit), Oromia Region"
        required
      />

      <div class="pt-4 flex justify-end">
        <BaseButton variant="primary" size="lg" @click="nextStep">
          <span>Continue to Step 2</span>
          <ArrowRight class="w-5 h-5 ml-2" />
        </BaseButton>
      </div>
    </div>

    <!-- STEP 2: Select Farm Type Cards -->
    <div v-else-if="currentStep === 2" class="space-y-4 pt-2">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          v-for="ft in farmTypeOptions"
          :key="ft.id"
          class="p-4 rounded-xl border-2 transition-all flex flex-col justify-between"
          :class="[
            ft.active
              ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 cursor-pointer ring-1 ring-primary-500/20'
              : 'border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 opacity-60 cursor-not-allowed'
          ]"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <component :is="ft.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <BaseBadge v-if="ft.comingSoon" variant="neutral" size="sm">
                Coming Soon
              </BaseBadge>
              <BaseBadge v-else variant="active" size="sm">
                Active Module
              </BaseBadge>
            </div>

            <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">{{ ft.name }}</h3>
            <p class="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-snug">
              {{ ft.desc }}
            </p>
          </div>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-between">
        <BaseButton variant="ghost" @click="prevStep">
          <ArrowLeft class="w-5 h-5 mr-1" /> Back
        </BaseButton>
        <BaseButton variant="primary" size="lg" @click="nextStep">
          <span>Continue to Step 3</span>
          <ArrowRight class="w-5 h-5 ml-2" />
        </BaseButton>
      </div>
    </div>

    <!-- STEP 3: Add First Flock -->
    <div v-else class="space-y-4 pt-2">
      <BaseInput
        v-model="flockLabel"
        label="Flock Label / Name"
        placeholder="e.g. Flock A - Bovans Brown Layers"
        required
      />

      <BaseSelect
        v-model="flockSpecies"
        label="Breed / Variety"
        :options="speciesOptions"
        required
      />

      <BaseNumberInput
        v-model="flockQuantity"
        label="Head Count / Initial Birds"
        :min="1"
        :step="25"
        required
      />

      <BaseInput
        v-model="flockStartDate"
        type="date"
        label="Placement Date"
        required
      />

      <div class="pt-4 flex items-center justify-between">
        <BaseButton variant="ghost" @click="prevStep">
          <ArrowLeft class="w-5 h-5 mr-1" /> Back
        </BaseButton>
        <BaseButton variant="primary" size="lg" :loading="isSubmitting" @click="finishSetup">
          <span>Finish & View Dashboard</span>
          <Check class="w-5 h-5 ml-2" />
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
