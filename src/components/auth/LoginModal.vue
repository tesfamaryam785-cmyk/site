<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import { Tractor, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-vue-next'

interface Props {
  show: boolean
  initialRole?: 'farmer' | 'buyer'
}

const props = withDefaults(defineProps<Props>(), {
  initialRole: 'farmer'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const selectedRole = ref<'farmer' | 'buyer'>(props.initialRole)
const emailOrPhone = ref('alazargrammar@gmail.com')
const password = ref('Alazar123')
const isSubmitting = ref(false)

watch(() => props.initialRole, (newRole) => {
  if (newRole) {
    selectedRole.value = newRole
  }
})

async function handleLogin() {
  if (!emailOrPhone.value) {
    toast.error('Validation Error', 'Please enter your email address or phone number.')
    return
  }

  isSubmitting.value = true
  try {
    await authStore.login(emailOrPhone.value, password.value, selectedRole.value)
    emit('close')

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
  <BaseModal
    :show="show"
    title="Sign In to Platform"
    @close="emit('close')"
  >
    <form @submit.prevent="handleLogin" class="space-y-5 pt-1">
      <!-- Role Choice Cards -->
      <div class="space-y-2">
        <label class="text-sm font-bold text-stone-900 dark:text-stone-100 block">
          Select Login Experience *
        </label>

        <div class="grid grid-cols-2 gap-3">
          <div
            @click="selectedRole = 'farmer'"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-1.5 select-none"
            :class="[
              selectedRole === 'farmer'
                ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/50 shadow-xs ring-2 ring-primary-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
            ]"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              :class="selectedRole === 'farmer' ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
            >
              <Tractor class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-xs text-stone-900 dark:text-stone-100">Farmer Mode</h3>
              <p class="text-[11px] text-stone-500 dark:text-stone-400">Farm Yield Telemetry</p>
            </div>
          </div>

          <div
            @click="selectedRole = 'buyer'"
            class="p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center justify-center gap-1.5 select-none"
            :class="[
              selectedRole === 'buyer'
                ? 'border-accent-500 bg-accent-50/70 dark:bg-accent-950/50 shadow-xs ring-2 ring-accent-500/30'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
            ]"
          >
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              :class="selectedRole === 'buyer' ? 'bg-accent-500 text-white' : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'"
            >
              <ShoppingBag class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-xs text-stone-900 dark:text-stone-100">Buyer Mode</h3>
              <p class="text-[11px] text-stone-500 dark:text-stone-400">Marketplace & Orders</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sample Credentials Badge -->
      <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-2 text-xs font-semibold">
        <ShieldCheck class="w-4 h-4 text-amber-600 shrink-0" />
        <span>Sample Account: <strong>alazargrammar@gmail.com</strong> / <strong>Alazar123</strong></span>
      </div>

      <BaseInput
        v-model="emailOrPhone"
        label="Email Address or Phone"
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
  </BaseModal>
</template>
