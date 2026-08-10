<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import BaseToast from '@/components/ui/BaseToast.vue'
import { Sprout, Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initTheme()
})
</script>

<template>
  <div class="min-h-screen bg-bg-light dark:bg-bg-dark text-stone-900 dark:text-stone-100 flex flex-col justify-between font-sans transition-colors duration-200 selection:bg-primary-500 selection:text-white">
    <!-- Header -->
    <header class="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold shadow-sm">
          <Sprout class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <span class="font-heading font-extrabold text-xl text-primary-600 dark:text-primary-400 tracking-tight leading-none">
            Alazar-Agri
          </span>
          <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wider mt-0.5">
            Agricultural Platform
          </span>
        </div>
      </RouterLink>

      <button
        type="button"
        @click="themeStore.toggleTheme"
        class="p-2.5 min-w-[44px] min-h-[44px] rounded-xl border border-stone-300 dark:border-stone-700 bg-card-light dark:bg-card-dark text-stone-700 dark:text-stone-200 flex items-center justify-center cursor-pointer shadow-2xs hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-400" />
        <Moon v-else class="w-5 h-5 text-primary-600" />
      </button>
    </header>

    <!-- Main Content Box -->
    <main class="flex-1 flex items-center justify-center p-4 md:p-8">
      <div class="w-full max-w-lg">
        <RouterView v-slot="{ Component }">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center text-xs text-stone-500 dark:text-stone-400">
      &copy; 2026 Alazar-Agri. High-Contrast Field Usability Engine.
    </footer>

    <!-- Global Toast Container -->
    <BaseToast />
  </div>
</template>
