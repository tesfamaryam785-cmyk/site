<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Store, PlusCircle, ShoppingBag } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { name: 'Browse Offers', path: '/marketplace/browse', icon: Store },
  { name: 'My Listings & Orders', path: '/marketplace/my-listings', icon: ShoppingBag },
  { name: '+ List a Product', path: '/marketplace/create', icon: PlusCircle }
]

function isCurrentTab(path: string) {
  return route.path === path || (route.path === '/marketplace' && path === '/marketplace/browse')
}
</script>

<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Marketplace Navigation Tabs Bar -->
    <div class="border-b border-stone-200 dark:border-stone-800 pb-1 overflow-x-auto">
      <nav class="flex items-center gap-2 min-w-max">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl font-semibold text-base transition-colors duration-150 touch-manipulation cursor-pointer select-none"
          :class="[
            isCurrentTab(tab.path)
              ? 'bg-accent-500 text-white shadow-xs font-bold'
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
