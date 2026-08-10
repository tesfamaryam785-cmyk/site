<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/authStore'
import BaseToast from '@/components/ui/BaseToast.vue'
import {
  LayoutDashboard,
  Tractor,
  Store,
  Settings,
  Sun,
  Moon,
  Sprout,
  Palette,
  ShoppingBag,
  LogOut,
  UserCheck,
  Package
} from 'lucide-vue-next'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

onMounted(() => {
  themeStore.initTheme()
})

const farmerNavItems = [
  { name: 'Landing Page', path: '/', icon: Sprout },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Farm', path: '/farm', matchPrefix: '/farm', icon: Tractor },
  { name: 'Marketplace', path: '/marketplace/browse', matchPrefix: '/marketplace', icon: Store },
  { name: 'Showcase', path: '/showcase', icon: Palette },
  { name: 'Settings', path: '/settings', icon: Settings }
]

const buyerNavItems = [
  { name: 'Landing Page', path: '/', icon: Sprout },
  { name: 'Browse', path: '/marketplace/browse', icon: Store },
  { name: 'My Orders', path: '/marketplace/my-listings', icon: Package },
  { name: 'Showcase', path: '/showcase', icon: Palette },
  { name: 'Settings', path: '/settings', icon: Settings }
]

const currentNavItems = computed(() => {
  return authStore.activeRole === 'farmer' ? farmerNavItems : buyerNavItems
})

function isActive(item: { path: string; matchPrefix?: string }) {
  if (item.matchPrefix) {
    return route.path.startsWith(item.matchPrefix)
  }
  return route.path === item.path
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-bg-light dark:bg-bg-dark text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 border-r border-stone-200 dark:border-stone-800 bg-card-light dark:bg-card-dark shrink-0 h-screen sticky top-0">
      <!-- App Brand Header -->
      <div class="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Sprout class="w-6 h-6" />
          </div>
          <div class="flex flex-col">
            <span class="font-heading font-extrabold text-xl text-primary-600 dark:text-primary-400 tracking-tight leading-none">
              Alazar-Agri
            </span>
            <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wider mt-1 uppercase">
              {{ authStore.activeRole }} VIEW
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <RouterLink
          v-for="item in currentNavItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3.5 px-4 py-3 min-h-[44px] rounded-xl font-semibold text-base transition-colors duration-150 touch-manipulation cursor-pointer select-none"
          :class="[
            isActive(item)
              ? 'bg-primary-500 text-white shadow-xs font-bold'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-stone-100'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Sidebar Footer / Theme Toggle & Logout -->
      <div class="p-4 border-t border-stone-200 dark:border-stone-800 space-y-2">
        <button
          type="button"
          @click="themeStore.toggleTheme"
          class="w-full flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-sm transition-colors cursor-pointer"
        >
          <span class="flex items-center gap-2.5">
            <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-primary-600" />
            <span>{{ themeStore.isDark ? 'Dark Mode' : 'Light Mode' }}</span>
          </span>
          <span class="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
            {{ themeStore.isDark ? 'ON' : 'OFF' }}
          </span>
        </button>

        <button
          type="button"
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300 font-semibold text-sm transition-colors cursor-pointer"
        >
          <LogOut class="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Top Navigation Header -->
    <header class="md:hidden sticky top-0 z-40 bg-card-light dark:bg-card-dark border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold">
          <Sprout class="w-5 h-5" />
        </div>
        <span class="font-heading font-extrabold text-base text-primary-600 dark:text-primary-400">
          Alazar-Agri ({{ authStore.activeRole.toUpperCase() }})
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="themeStore.toggleTheme"
          class="p-2 min-w-[44px] min-h-[44px] rounded-xl border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-400" />
          <Moon v-else class="w-5 h-5 text-primary-600" />
        </button>
      </div>
    </header>

    <!-- Main Content Container -->
    <main class="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
      <div class="p-4 md:p-8 max-w-7xl w-full mx-auto">
        <RouterView v-slot="{ Component }">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-1.5"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1.5"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card-light dark:bg-card-dark border-t border-stone-200 dark:border-stone-800 flex items-center justify-around px-2 py-2">
      <RouterLink
        v-for="item in currentNavItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-h-[44px] min-w-[44px] transition-colors"
        :class="[isActive(item) ? 'text-primary-600 dark:text-primary-400 font-extrabold' : 'text-stone-600 dark:text-stone-400']"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span class="text-xs tracking-tight mt-0.5">{{ item.name.split(' ')[0] }}</span>
      </RouterLink>
    </nav>

    <!-- Global Toast Banner -->
    <BaseToast />
  </div>
</template>
