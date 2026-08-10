<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  UserCheck
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useMarketplaceStore()
const authStore = useAuthStore()
const toast = useToast()

const orderQty = ref(1)
const isContactModalOpen = ref(false)
const isSubmitting = ref(false)

const listingId = computed(() => route.params.id as string)

onMounted(async () => {
  await store.fetchListingById(listingId.value)
})

const listing = computed(() => store.currentListing)

const totalPrice = computed(() => {
  if (!listing.value) return 0
  return listing.value.price * orderQty.value
})

function getSellerRoleBadge(role: string) {
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

async function handlePlaceOrder() {
  if (!listing.value) return
  if (orderQty.value > listing.value.quantityAvailable) {
    toast.error('Quantity Error', 'Requested quantity exceeds available stock.')
    return
  }

  isSubmitting.value = true
  try {
    await store.placeOrder({
      listingId: listing.value.id,
      listingTitle: listing.value.title,
      buyerId: 'user-farmer-1',
      sellerId: listing.value.sellerId,
      sellerName: listing.value.sellerName,
      quantity: orderQty.value,
      totalPrice: totalPrice.value,
      status: 'completed'
    })
    toast.success(
      'Order Confirmed!',
      `Successfully placed order for ${orderQty.value} ${listing.value.unit}(s) totaling ${totalPrice.value.toLocaleString()} Birr.`
    )
    router.push('/marketplace/my-listings')
  } catch (e) {
    toast.error('Order Error', 'Failed to place order.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button
      type="button"
      @click="router.back()"
      class="inline-flex items-center text-sm font-bold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4 mr-1.5" /> Back to Marketplace Browse
    </button>

    <!-- Skeleton Loading -->
    <div v-if="store.loading && !listing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SkeletonLoader variant="card" height="350px" />
      <SkeletonLoader variant="card" height="350px" />
    </div>

    <!-- Listing Detail Body -->
    <div v-else-if="listing" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left: Large Image & Description (2 Columns) -->
      <div class="lg:col-span-2 space-y-6">
        <BaseCard padding="none" class="overflow-hidden">
          <div class="h-96 w-full bg-stone-200 dark:bg-stone-800">
            <img
              :src="listing.images[0]"
              :alt="listing.title"
              class="w-full h-full object-cover"
            />
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
                Product Description
              </h2>
              <BaseBadge variant="neutral">{{ listing.category }}</BaseBadge>
            </div>
          </template>

          <div class="space-y-4">
            <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
              {{ listing.title }}
            </h1>
            <p class="text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {{ listing.description }}
            </p>
          </div>
        </BaseCard>
      </div>

      <!-- Right: Seller Card & Purchase Order Form (1 Column) -->
      <div class="space-y-6">
        <!-- Order Box Card -->
        <BaseCard highlighted highlight-variant="primary" class="space-y-4">
          <div class="space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-stone-500">Unit Price</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-extrabold font-heading text-primary-600 dark:text-primary-400">
                {{ listing.price.toLocaleString() }} Birr
              </span>
              <span class="text-sm font-semibold text-stone-600 dark:text-stone-400">
                / {{ listing.unit }}
              </span>
            </div>
            <div class="text-xs font-semibold text-stone-500">
              Available Stock: {{ listing.quantityAvailable }} {{ listing.unit }}s
            </div>
          </div>

          <div class="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-4">
            <BaseNumberInput
              v-model="orderQty"
              label="Select Quantity"
              :min="1"
              :max="listing.quantityAvailable"
              :step="1"
            />

            <div class="flex items-center justify-between py-2 border-y border-stone-200 dark:border-stone-800">
              <span class="font-bold text-base">Total Price:</span>
              <span class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
                {{ totalPrice.toLocaleString() }} Birr
              </span>
            </div>

            <BaseButton
              v-if="authStore.isAuthenticated"
              variant="primary"
              size="lg"
              class="w-full"
              :disabled="listing.quantityAvailable === 0"
              :loading="isSubmitting"
              @click="handlePlaceOrder"
            >
              <ShoppingBag class="w-5 h-5 mr-2" />
              {{ listing.quantityAvailable > 0 ? 'Place Order Now' : 'Sold Out' }}
            </BaseButton>

            <BaseButton
              v-else
              variant="primary"
              size="lg"
              class="w-full"
              @click="router.push('/login')"
            >
              <ShoppingBag class="w-5 h-5 mr-2" />
              Sign In to Place Order
            </BaseButton>
          </div>
        </BaseCard>

        <!-- Seller Profile Card -->
        <BaseCard class="space-y-4">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold font-heading text-lg">Seller Profile</h3>
              <span
                class="px-2.5 py-0.5 rounded-md border text-xs font-extrabold uppercase tracking-wide"
                :class="getSellerRoleBadge(listing.sellerRole).class"
              >
                {{ getSellerRoleBadge(listing.sellerRole).label }}
              </span>
            </div>
          </template>

          <div class="space-y-3">
            <div class="font-bold text-lg text-stone-900 dark:text-stone-100">
              {{ listing.sellerName }}
            </div>

            <div class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <MapPin class="w-4 h-4 text-stone-400 shrink-0" />
              <span>{{ listing.location }}</span>
            </div>

            <div class="pt-3 flex flex-col gap-2">
              <BaseButton variant="secondary" @click="isContactModalOpen = true">
                <Phone class="w-4 h-4 mr-2" />
                Contact Seller
              </BaseButton>

              <RouterLink
                :to="`/marketplace/seller/${listing.sellerId}`"
                class="text-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline pt-1"
              >
                View Full Seller Storefront →
              </RouterLink>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Contact Modal -->
    <BaseModal
      :show="isContactModalOpen"
      title="Contact Seller"
      @close="isContactModalOpen = false"
    >
      <div class="space-y-4">
        <p class="text-base text-stone-800 dark:text-stone-200">
          Direct contact information for <strong>{{ listing?.sellerName }}</strong>:
        </p>

        <div class="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/80 space-y-2">
          <div class="flex items-center gap-3">
            <Phone class="w-5 h-5 text-primary-600" />
            <span class="font-bold text-base">+254 712 345 678</span>
          </div>
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-primary-600" />
            <span class="font-bold text-base">sales@agri-platform-vendor.com</span>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="primary" @click="isContactModalOpen = false">
          Close Contact Info
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
