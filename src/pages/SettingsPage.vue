<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/theme'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { Sun, Moon, RotateCcw, AlertTriangle, UserCheck, ShoppingBag, Tractor } from 'lucide-vue-next'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const router = useRouter()
const toast = useToast()

const isResetModalOpen = ref(false)

function handleRoleSwitch() {
  const targetRole = authStore.activeRole === 'farmer' ? 'buyer' : 'farmer'
  authStore.switchRole(targetRole)
  toast.success('Role Switched!', `Now viewing platform as ${targetRole === 'farmer' ? 'Farmer' : 'Buyer'}.`)

  if (targetRole === 'buyer') {
    router.push('/marketplace/browse')
  } else {
    router.push('/dashboard')
  }
}

function confirmResetSampleData() {
  localStorage.clear()
  toast.success('Sample Data Restored', 'Restoring starting seed state...')
  setTimeout(() => {
    window.location.href = '/dashboard'
  }, 600)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
        Platform Settings & Role Switcher
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-1 text-base">
        Configure viewing experience, theme contrast, and platform role controls.
      </p>
    </div>

    <!-- Platform Role Switcher Card -->
    <BaseCard highlighted highlight-variant="primary">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UserCheck class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            Platform Role Switcher
          </h2>
          <BaseBadge :variant="authStore.activeRole === 'farmer' ? 'active' : 'info'">
            {{ authStore.activeRole.toUpperCase() }} MODE
          </BaseBadge>
        </div>
      </template>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div class="space-y-1">
          <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">
            Currently viewing as: <span class="text-primary-600 dark:text-primary-400 capitalize">{{ authStore.activeRole }}</span>
          </h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
            Switch between Farmer (full farm management & yield telemetry) and Buyer (marketplace product catalog & orders) experiences.
          </p>
        </div>

        <BaseButton
          :variant="authStore.activeRole === 'farmer' ? 'secondary' : 'primary'"
          size="lg"
          @click="handleRoleSwitch"
        >
          <Tractor v-if="authStore.activeRole === 'buyer'" class="w-5 h-5 mr-2" />
          <ShoppingBag v-else class="w-5 h-5 mr-2" />
          <span>Switch to {{ authStore.activeRole === 'farmer' ? 'Buyer' : 'Farmer' }} View</span>
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Theme & Display Settings Card -->
    <BaseCard>
      <template #header>
        <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
          Display & Outdoor Mode
        </h2>
      </template>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">Dark Mode Contrast Strategy</h3>
          <p class="text-sm text-stone-600 dark:text-stone-400">
            Toggle high-contrast dark theme optimized for low-light or night operations.
          </p>
        </div>

        <BaseButton variant="secondary" @click="themeStore.toggleTheme">
          <span class="flex items-center gap-2">
            <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-primary-600" />
            <span>{{ themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}</span>
          </span>
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Platform State Controls Card -->
    <BaseCard highlighted highlight-variant="accent">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <RotateCcw class="w-5 h-5 text-accent-500" />
            Platform State Controls
          </h2>
          <span class="text-xs font-bold px-2 py-0.5 rounded bg-accent-100 text-accent-950 dark:bg-accent-950 dark:text-accent-200 uppercase">
            Data Management
          </span>
        </div>
      </template>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div>
          <h3 class="font-bold text-base text-stone-900 dark:text-stone-100">Restore Starting Data</h3>
          <p class="text-sm text-stone-600 dark:text-stone-400 max-w-xl">
            Clears added flocks, logged records, transactions, and marketplace orders stored in LocalStorage, returning the application to its clean starting data state.
          </p>
        </div>

        <BaseButton variant="danger" size="lg" @click="isResetModalOpen = true">
          <RotateCcw class="w-5 h-5 mr-2" />
          Restore Starting Data
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Profile Information Card -->
    <BaseCard>
      <template #header>
        <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
          User Account Profile
        </h2>
      </template>

      <div class="space-y-4">
        <BaseInput label="Account Email" :model-value="authStore.user?.email || 'alazargrammar@gmail.com'" readonly />
        <BaseInput label="User Name" :model-value="authStore.user?.name || 'Alazar Grammar'" readonly />
        <BaseInput label="Current Active View" :model-value="`Active Role: ${authStore.activeRole.toUpperCase()}`" readonly />
      </div>
    </BaseCard>

    <!-- Reset Confirmation Modal -->
    <BaseModal
      :show="isResetModalOpen"
      title="Restore Starting Data Confirmation"
      @close="isResetModalOpen = false"
    >
      <div class="space-y-4">
        <p class="text-base text-stone-800 dark:text-stone-200">
          Are you sure you want to restore all platform data to the clean starting state?
        </p>

        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-sm">
          <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
          <span>This action will clear all user-added flocks, egg logs, feed records, transactions, and new marketplace listings from LocalStorage.</span>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="isResetModalOpen = false">
          Cancel
        </BaseButton>
        <BaseButton variant="danger" @click="confirmResetSampleData">
          Restore Starting Data
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
