<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import {
  Search,
  MapPin,
  Tag,
  PlusCircle,
  ShoppingBag,
  Store,
  Building2,
  Tractor,
  Feather,
  Sparkles
} from 'lucide-vue-next'

const store = useMarketplaceStore()
const router = useRouter()

const categoryChips = [
  { label: 'All Categories', value: 'All', active: true },
  { label: 'Poultry & Chicks', value: 'Poultry & Chicks', active: true },
  { label: 'Eggs', value: 'Eggs', active: true },
  { label: 'Feed & Nutrition', value: 'Feed', active: true },
  { label: 'Equipment & Solar', value: 'Equipment', active: true },
  { label: 'Dairy Cattle', value: 'Dairy', active: false, comingSoon: true },
  { label: 'Livestock & Goats', value: 'Livestock', active: false, comingSoon: true },
  { label: 'Crops & Inputs', value: 'Crops', active: false, comingSoon: true }
]

onMounted(() => {
  store.fetchListings()
})

function selectCategory(catVal: string) {
  store.selectedCategory = catVal
}

function getSellerRoleBadge(role: string) {
  switch (role) {
    case 'farmer':
      return { label: 'Farmer', class: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' }
    case 'feed_company':
      return { label: 'Feed Company', class: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200' }
    case 'hatchery':
      return { label: 'Hatchery', class: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200' }
    case 'supplier':
    case 'distributor':
    default:
      return { label: 'Supplier', class: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-200' }
  }
}

function goToListing(id: string) {
  router.push(`/marketplace/${id}`)
}
</script>

<template>
  <div class="space-y-8 md:space-y-10">
    <!-- Marketplace Top Banner & Search Filter Bar -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2.5">
            <Store class="w-7 h-7 text-primary-600 dark:text-primary-400" />
            Agricultural Marketplace
          </h1>
          <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-base">
            Verified agricultural inputs, chicks, feed, equipment, and harvest batch trading.
          </p>
        </div>

        <BaseButton variant="primary" @click="router.push('/marketplace/create')" size="lg">
          <PlusCircle class="w-5 h-5 mr-2" />
          + List a Product (Sell Here)
        </BaseButton>
      </div>

      <!-- Search & Location Filter Bar -->
      <BaseCard padding="sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="relative md:col-span-2">
            <BaseInput
              v-model="store.searchQuery"
              placeholder="Search by title, feed brand, seller name..."
            />
          </div>

          <div>
            <BaseInput
              v-model="store.locationFilter"
              placeholder="Filter by location (e.g. Rift Valley)..."
            />
          </div>
        </div>

        <!-- Category Filter Chips -->
        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto">
          <button
            v-for="chip in categoryChips"
            :key="chip.value"
            type="button"
            @click="selectCategory(chip.value)"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
            :class="[
              store.selectedCategory === chip.value
                ? 'bg-primary-500 text-white border-primary-600 shadow-2xs'
                : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 hover:bg-stone-200'
            ]"
          >
            <span>{{ chip.label }}</span>
            <span v-if="chip.comingSoon" class="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 uppercase">
              Soon
            </span>
          </button>
        </div>
      </BaseCard>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="store.loading && !store.isLoaded" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkeletonLoader variant="card" :count="6" />
    </div>

    <!-- 10+ Listing Cards Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="listing in store.filteredListings"
        :key="listing.id"
        @click="goToListing(listing.id)"
        class="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-card-light dark:bg-card-dark overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
      >
        <div>
          <!-- Product Image & Category Badge Overlay -->
          <div class="relative h-48 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
            <img
              :src="listing.images[0]"
              :alt="listing.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div class="absolute top-3 left-3">
              <BaseBadge variant="neutral" size="sm">
                {{ listing.category }}
              </BaseBadge>
            </div>
            <div v-if="listing.status === 'sold_out'" class="absolute top-3 right-3">
              <BaseBadge variant="danger" size="sm">
                Sold Out
              </BaseBadge>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4 space-y-2">
            <h3 class="font-bold font-heading text-stone-900 dark:text-stone-100 text-base line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ listing.title }}
            </h3>

            <!-- Price & Unit -->
            <div class="flex items-baseline gap-1">
              <span class="text-xl font-extrabold font-heading text-primary-600 dark:text-primary-400">
                {{ listing.price.toLocaleString() }} Birr
              </span>
              <span class="text-xs font-semibold text-stone-500">
                / {{ listing.unit }}
              </span>
            </div>

            <!-- Seller Info & Role Badge -->
            <div class="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
              <span class="font-medium text-stone-700 dark:text-stone-300 truncate max-w-[140px]">
                {{ listing.sellerName }}
              </span>

              <span
                class="px-2 py-0.5 rounded-md border text-[11px] font-extrabold uppercase tracking-wide shrink-0"
                :class="getSellerRoleBadge(listing.sellerRole).class"
              >
                {{ getSellerRoleBadge(listing.sellerRole).label }}
              </span>
            </div>

            <!-- Location -->
            <div class="flex items-center gap-1 text-xs text-stone-500">
              <MapPin class="w-3.5 h-3.5 shrink-0 text-stone-400" />
              <span class="truncate">{{ listing.location }}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-4 py-3 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
          <span class="text-xs font-semibold text-stone-600 dark:text-stone-400">
            Qty: {{ listing.quantityAvailable }} {{ listing.unit }}s
          </span>
          <span class="text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-0.5 transition-transform">
            View Listing →
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
