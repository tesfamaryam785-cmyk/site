<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { Tractor, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const selectedRole = ref<'farmer' | 'buyer'>('farmer')
const emailOrPhone = ref('alazargrammar@gmail.com')
const password = ref('Alazar123')
const isSubmitting = ref(false)

async function handleLogin() {
  if (!emailOrPhone.value) {
    toast.error('Validation Error', 'Please enter your email address or phone number.')
    return
  }

  isSubmitting.value = true
  try {
    await authStore.login(emailOrPhone.value, password.value, selectedRole.value)

    if (selectedRole.value === 'farmer') {
      toast.success('Welcome Back, Farmer!', 'Logged in to Farm Management Dashboard.')
      router.push('/dashboard')
    } else {
      toast.success('Welcome, Buyer!', 'Navigating to Agricultural Marketplace.')
      router.push('/marketplace/browse')
    }
  } catch (e) {
    toast.error('Login Error', 'Failed to authenticate session.')
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
          Sign In to Agri-Platform
        </h1>
        <p class="text-stone-600 dark:text-stone-400 text-sm">
          Select your entry role experience to continue.
        </p>
      </div>
    </template>

    <form @submit.prevent="handleLogin" class="space-y-5 pt-2">
      <!-- Role Choice Selection Cards at Top -->
      <div class="space-y-2">
        <label class="text-base font-semibold text-stone-900 dark:text-stone-100 block">
          Select Login Experience *
        </label>

        <div class="grid grid-cols-2 gap-3">
          <!-- Farmer Option -->
          <div
            @click="selectedRole = 'farmer'"
            class="p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-2 select-none"
            :class="[
              selectedRole === 'farmer'
                ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/50 shadow-xs ring-2 ring-primary-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
            ]"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
              :class="selectedRole === 'farmer' ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
            >
              <Tractor class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-stone-900 dark:text-stone-100">Continue as Farmer</h3>
              <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Farm & Yield Telemetry</p>
            </div>
          </div>

          <!-- Buyer Option -->
          <div
            @click="selectedRole = 'buyer'"
            class="p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-2 select-none"
            :class="[
              selectedRole === 'buyer'
                ? 'border-accent-500 bg-accent-50/70 dark:bg-accent-950/50 shadow-xs ring-2 ring-accent-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
            ]"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
              :class="selectedRole === 'buyer' ? 'bg-accent-500 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
            >
              <ShoppingBag class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-bold text-sm text-stone-900 dark:text-stone-100">Continue as Buyer</h3>
              <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Marketplace & Orders</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sample Credentials Badge -->
      <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-2.5 text-xs font-semibold">
        <ShieldCheck class="w-4 h-4 text-amber-600 shrink-0" />
        <span>Sample Account Pre-filled: <strong>alazargrammar@gmail.com</strong> / <strong>Alazar123</strong></span>
      </div>

      <!-- Standard Email & Password Fields -->
      <BaseInput
        v-model="emailOrPhone"
        label="Email Address or Mobile Phone"
        placeholder="alazargrammar@gmail.com"
        required
      />

      <BaseInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Alazar123"
        required
      />

      <div class="pt-2">
        <BaseButton
          :variant="selectedRole === 'farmer' ? 'primary' : 'secondary'"
          size="lg"
          type="submit"
          class="w-full"
          :loading="isSubmitting"
        >
          <span>Sign In as {{ selectedRole === 'farmer' ? 'Farmer' : 'Buyer' }}</span>
          <ArrowRight class="w-5 h-5 ml-2" />
        </BaseButton>
      </div>
    </form>

    <template #footer>
      <div class="text-center text-sm text-stone-600 dark:text-stone-400">
        Need a new farm account?
        <RouterLink to="/register" class="font-bold text-primary-600 dark:text-primary-400 hover:underline ml-1">
          Register Here
        </RouterLink>
      </div>
    </template>
  </BaseCard>
</template>
