<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import type { User } from '@/types'
import { Tractor, Store, Egg, Wheat, ArrowRight } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const name = ref('')
const emailOrPhone = ref('')
const password = ref('')
const selectedRole = ref<User['role']>('farmer')
const isSubmitting = ref(false)

const roleCards: { role: User['role']; title: string; desc: string; icon: any }[] = [
  {
    role: 'farmer',
    title: 'Farmer / Producer',
    desc: 'Manage flock yields, daily production, feed, and farm ledger.',
    icon: Tractor
  },
  {
    role: 'supplier',
    title: 'Supplier / Distributor',
    desc: 'Sell agricultural equipment, hardware, and solar technology.',
    icon: Store
  },
  {
    role: 'hatchery',
    title: 'Commercial Hatchery',
    desc: 'List day-old vaccinated chicks and fertile hatching eggs.',
    icon: Egg
  },
  {
    role: 'feed_company',
    title: 'Feed Manufacturer',
    desc: 'Offer commercial poultry mash, pellets, and nutritional supplements.',
    icon: Wheat
  }
]

async function handleRegister() {
  if (!name.value || !emailOrPhone.value) {
    toast.error('Validation Error', 'Please complete all required fields.')
    return
  }

  isSubmitting.value = true
  try {
    await authStore.register(name.value, emailOrPhone.value, selectedRole.value)
    toast.success('Account Created!', 'Proceeding to 3-step farm setup wizard.')
    router.push('/auth/farm-setup')
  } catch (e) {
    toast.error('Registration Error', 'Unable to complete registration.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseCard highlighted highlight-variant="primary" class="shadow-xl">
    <template #header>
      <div class="space-y-1 text-center py-2">
        <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
          Create Your Platform Account
        </h1>
        <p class="text-stone-600 dark:text-stone-400 text-sm">
          Select your primary role in the agricultural ecosystem.
        </p>
      </div>
    </template>

    <form @submit.prevent="handleRegister" class="space-y-5 pt-2">
      <!-- Role Selector Cards -->
      <div class="space-y-2">
        <label class="text-base font-semibold text-stone-900 dark:text-stone-100 block">
          Select Platform Role *
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="rc in roleCards"
            :key="rc.role"
            @click="selectedRole = rc.role"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="[
              selectedRole === rc.role
                ? 'border-primary-500 bg-primary-50/60 dark:bg-primary-950/40 shadow-xs ring-1 ring-primary-500/20'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
            ]"
          >
            <div class="flex items-center gap-2 mb-1.5">
              <component
                :is="rc.icon"
                class="w-5 h-5"
                :class="selectedRole === rc.role ? 'text-primary-600 dark:text-primary-400' : 'text-stone-500'"
              />
              <h3 class="font-bold text-sm text-stone-900 dark:text-stone-100">{{ rc.title }}</h3>
            </div>
            <p class="text-xs text-stone-600 dark:text-stone-400 leading-snug">
              {{ rc.desc }}
            </p>
          </div>
        </div>
      </div>

      <BaseInput
        v-model="name"
        label="Full Name / Operator Name"
        placeholder="e.g. John Doe"
        required
      />

      <BaseInput
        v-model="emailOrPhone"
        label="Email Address or Mobile Phone"
        placeholder="e.g. john@greenvalley.com or +254 712 345 678"
        required
      />

      <BaseInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        required
      />

      <div class="pt-2">
        <BaseButton
          variant="primary"
          size="lg"
          type="submit"
          class="w-full"
          :loading="isSubmitting"
        >
          <span>Proceed to Farm Setup</span>
          <ArrowRight class="w-5 h-5 ml-2" />
        </BaseButton>
      </div>
    </form>

    <template #footer>
      <div class="text-center text-sm text-stone-600 dark:text-stone-400">
        Already registered?
        <RouterLink to="/login" class="font-bold text-primary-600 dark:text-primary-400 hover:underline ml-1">
          Sign In
        </RouterLink>
      </div>
    </template>
  </BaseCard>
</template>
