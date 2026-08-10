import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService, SAMPLE_USER } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: 'user-farmer-1',
    name: 'Alazar Grammar',
    email: SAMPLE_USER.email,
    phone: '+254 712 345 678',
    role: 'farmer'
  })
  const activeRole = ref<'farmer' | 'buyer'>('farmer')
  const isAuthenticated = ref<boolean>(true)
  const isFarmSetupCompleted = ref<boolean>(true)
  const loading = ref<boolean>(false)

  const userRoleBadge = computed(() => {
    if (activeRole.value === 'buyer') return 'Buyer Mode'
    switch (user.value?.role) {
      case 'farmer':
        return 'Verified Farmer'
      case 'feed_company':
        return 'Feed Manufacturer'
      case 'hatchery':
        return 'Certified Hatchery'
      case 'supplier':
      case 'distributor':
      default:
        return 'Verified Supplier'
    }
  })

  async function login(emailOrPhone: string, password?: string, roleChoice: 'farmer' | 'buyer' = 'farmer') {
    loading.value = true
    try {
      user.value = await authService.login(emailOrPhone, password, roleChoice)
      activeRole.value = roleChoice
      isAuthenticated.value = true
      return user.value
    } finally {
      loading.value = false
    }
  }

  async function register(name: string, emailOrPhone: string, role: User['role']) {
    loading.value = true
    try {
      user.value = await authService.register({ name, emailOrPhone, role })
      activeRole.value = role === 'farmer' ? 'farmer' : 'buyer'
      isAuthenticated.value = true
      isFarmSetupCompleted.value = false
      return user.value
    } finally {
      loading.value = false
    }
  }

  function switchRole(newRole: 'farmer' | 'buyer') {
    activeRole.value = newRole
    if (user.value) {
      user.value.role = newRole === 'farmer' ? 'farmer' : 'supplier'
    }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    activeRole,
    isAuthenticated,
    isFarmSetupCompleted,
    loading,
    userRoleBadge,
    login,
    register,
    switchRole,
    logout
  }
}, {
  persist: true
})
