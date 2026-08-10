<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Tractor, Egg, Wheat, AlertOctagon, HeartPulse, DollarSign } from 'lucide-vue-next'

const route = useRoute()

const farmTabs = [
  { name: 'Flocks & Herd', path: '/farm/flocks', icon: Tractor },
  { name: 'Egg Production', path: '/farm/production', icon: Egg },
  { name: 'Feed Records', path: '/farm/feed', icon: Wheat },
  { name: 'Mortality Logs', path: '/farm/mortality', icon: AlertOctagon },
  { name: 'Health & Vaccines', path: '/farm/health', icon: HeartPulse },
  { name: 'Financial Ledger', path: '/farm/transactions', icon: DollarSign }
]

function isCurrentTab(path: string) {
  return route.path === path
}
</script>

<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Horizontal Tab Bar for Farm Sub-Pages -->
    <div class="border-b border-stone-200 dark:border-stone-800 pb-1 overflow-x-auto">
      <nav class="flex items-center gap-2 min-w-max">
        <RouterLink
          v-for="tab in farmTabs"
          :key="tab.path"
          :to="tab.path"
          class="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-semibold text-base transition-colors duration-150 touch-manipulation cursor-pointer select-none"
          :class="[
            isCurrentTab(tab.path)
              ? 'bg-primary-500 text-white shadow-xs font-bold'
              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          ]"
        >
          <component :is="tab.icon" class="w-5 h-5 shrink-0" />
          <span>{{ tab.name }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Active Sub-route View -->
    <RouterView />
  </div>
</template>
