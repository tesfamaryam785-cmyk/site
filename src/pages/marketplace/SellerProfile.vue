<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { MapPin, Phone, Mail, ShieldCheck, ArrowLeft, Store } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useMarketplaceStore()

const sellerId = computed(() => route.params.id as string)

onMounted(() => {
  store.fetchSellerProfile(sellerId.value)
})

const seller = computed(() => store.currentSeller)
const sellerListings = computed(() => {
  return store.listings.filter(l => l.sellerId === sellerId.value)
})

function getSellerRoleBadge(role?: string) {
  switch (role) {
    case 'farmer':
      return { label: 'Verified Farmer', class: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' }
    case 'feed_company':
      return { label: 'Feed Manufacturer', class: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200' }
    case 'hatchery':
      return { label: 'Certified Hatchery', class: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200' }
    case 'supplier':
    case 'distributor':
    default:
      return { label: 'Verified Supplier', class: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-200' }
  }
}
</script>

<template>
  <div class="space-y-6">
    <button
      type="button"
      @click="router.back()"
      class="inline-flex items-center text-sm font-bold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4 mr-1.5" /> Back to Marketplace Browse
    </button>

    <!-- Skeleton Loading -->
    <div v-if="store.loading && !seller" class="space-y-6">
      <SkeletonLoader variant="card" height="150px" />
      <SkeletonLoader variant="card" height="300px" />
    </div>

    <template v-else-if="seller">
      <!-- Seller Storefront Banner -->
      <BaseCard highlighted highlight-variant="primary">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
                {{ seller.name }}
              </h1>
              <span
                class="px-3 py-1 rounded-md border text-xs font-extrabold uppercase tracking-wide shrink-0"
                :class="getSellerRoleBadge(seller.role).class"
              >
                {{ getSellerRoleBadge(seller.role).label }}
              </span>
            </div>

            <p class="text-base text-stone-700 dark:text-stone-300">
              Verified seller storefront delivering high quality agricultural inputs, stock, and feed supplies.
            </p>

            <div class="flex items-center gap-4 text-sm text-stone-600 dark:text-stone-400 pt-1">
              <span class="flex items-center gap-1">
                <MapPin class="w-4 h-4 text-stone-400" /> Naivasha & Rift Valley Region
              </span>
              <span class="flex items-center gap-1">
                <Phone class="w-4 h-4 text-stone-400" /> {{ seller.phone }}
              </span>
            </div>
          </div>

          <div class="shrink-0 flex flex-col items-end gap-2">
            <BaseBadge variant="active" size="md">
              <ShieldCheck class="w-4 h-4 mr-1" />
              Verified Seller
            </BaseBadge>
            <span class="text-xs font-semibold text-stone-500">
              {{ sellerListings.length }} Active Offers
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Active Seller Listings Grid -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Store class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          Active Storefront Product Catalog
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="item in sellerListings"
            :key="item.id"
            @click="router.push(`/marketplace/${item.id}`)"
            class="group rounded-2xl border border-stone-200 dark:border-stone-800 bg-card-light dark:bg-card-dark overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div class="h-44 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <img :src="item.images[0]" :alt="item.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div class="p-4 space-y-2">
                <h3 class="font-bold text-base line-clamp-2">{{ item.title }}</h3>
                <div class="text-xl font-extrabold text-primary-600 dark:text-primary-400">
                  {{ item.price.toLocaleString() }} Birr <span class="text-xs text-stone-500 font-normal">/ {{ item.unit }}</span>
                </div>
              </div>
            </div>
            <div class="p-4 bg-stone-50 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs">
              <span class="text-stone-500">Qty: {{ item.quantityAvailable }}</span>
              <span class="font-bold text-primary-600">View Listing →</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
