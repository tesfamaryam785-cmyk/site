<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { PlusCircle, ShoppingBag, Store, CheckCircle, Package } from 'lucide-vue-next'

const store = useMarketplaceStore()
const router = useRouter()
const toast = useToast()

const activeTab = ref<'my-listings' | 'my-orders'>('my-listings')

onMounted(() => {
  store.fetchMyListings('user-farmer-1')
  store.fetchMyOrders('user-farmer-1')
})

function toggleStatus(id: string) {
  const listing = store.myListings.find(l => l.id === id)
  if (listing) {
    listing.status = listing.status === 'active' ? 'paused' : 'active'
    toast.info('Status Updated', `Listing is now ${listing.status}.`)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
          My Marketplace Portal
        </h1>
        <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-base">
          Manage your seller listings and view placed buyer orders.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <BaseButton variant="primary" @click="router.push('/marketplace/create')">
          <PlusCircle class="w-5 h-5 mr-2" />
          + List New Product
        </BaseButton>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-1">
      <button
        type="button"
        @click="activeTab = 'my-listings'"
        class="px-5 py-3 rounded-xl font-bold text-base transition-all cursor-pointer flex items-center gap-2"
        :class="activeTab === 'my-listings' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'"
      >
        <Store class="w-5 h-5" />
        <span>My Listings ({{ store.myListings.length }})</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'my-orders'"
        class="px-5 py-3 rounded-xl font-bold text-base transition-all cursor-pointer flex items-center gap-2"
        :class="activeTab === 'my-orders' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'"
      >
        <ShoppingBag class="w-5 h-5" />
        <span>My Orders ({{ store.myOrders.length }})</span>
      </button>
    </div>

    <!-- TAB 1: My Listings -->
    <div v-if="activeTab === 'my-listings'" class="space-y-4">
      <div v-if="store.myListings.length === 0" class="text-center py-12">
        <p class="text-stone-500">You have no active seller listings yet.</p>
        <BaseButton variant="primary" class="mt-4" @click="router.push('/marketplace/create')">
          Create Your First Listing
        </BaseButton>
      </div>

      <div v-else class="space-y-4">
        <BaseCard
          v-for="item in store.myListings"
          :key="item.id"
          padding="md"
        >
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img :src="item.images[0]" :alt="item.title" class="w-20 h-20 object-cover rounded-xl border shrink-0" />
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-lg text-stone-900 dark:text-stone-100">{{ item.title }}</h3>
                  <BaseBadge :variant="item.status === 'active' ? 'active' : 'neutral'">
                    {{ item.status }}
                  </BaseBadge>
                </div>
                <p class="text-sm text-stone-600 dark:text-stone-400 font-semibold">
                  {{ item.price.toLocaleString() }} Birr / {{ item.unit }} • Qty: {{ item.quantityAvailable }} available
                </p>
                <div class="text-xs text-stone-500">Category: {{ item.category }}</div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <BaseButton variant="secondary" @click="toggleStatus(item.id)">
                {{ item.status === 'active' ? 'Pause Listing' : 'Activate' }}
              </BaseButton>

              <RouterLink :to="`/marketplace/${item.id}`">
                <BaseButton variant="ghost">View</BaseButton>
              </RouterLink>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- TAB 2: My Orders -->
    <div v-else class="space-y-4">
      <div v-if="store.myOrders.length === 0" class="text-center py-12">
        <p class="text-stone-500">No orders placed yet.</p>
        <BaseButton variant="primary" class="mt-4" @click="router.push('/marketplace')">
          Browse Marketplace
        </BaseButton>
      </div>

      <div v-else class="space-y-4">
        <BaseCard v-for="order in store.myOrders" :key="order.id">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <Package class="w-5 h-5 text-primary-600" />
                <h3 class="font-bold text-lg text-stone-900 dark:text-stone-100">
                  {{ order.listingTitle || 'Agricultural Product Order' }}
                </h3>
              </div>
              <p class="text-sm text-stone-600 dark:text-stone-400">
                Seller: {{ order.sellerName }} • Qty: {{ order.quantity }}
              </p>
              <div class="text-xs text-stone-500 font-mono">
                Order ID: {{ order.id }} • Date: {{ order.createdAt.split('T')[0] }}
              </div>
            </div>

            <div class="flex flex-col items-end gap-1">
              <BaseBadge variant="active">Order Completed</BaseBadge>
              <span class="text-xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
                {{ order.totalPrice.toLocaleString() }} Birr
              </span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
