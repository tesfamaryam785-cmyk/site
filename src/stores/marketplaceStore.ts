import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, MarketplaceListing, MarketplaceOrder } from '@/types'
import { marketplaceService } from '@/services/marketplaceService'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const listings = ref<MarketplaceListing[]>([])
  const myListings = ref<MarketplaceListing[]>([])
  const myOrders = ref<MarketplaceOrder[]>([])
  const currentListing = ref<MarketplaceListing | null>(null)
  const currentSeller = ref<User | null>(null)

  const selectedCategory = ref<string>('All')
  const searchQuery = ref<string>('')
  const locationFilter = ref<string>('')

  const loading = ref<boolean>(false)
  const isLoaded = ref<boolean>(false)

  // Computed filtered listings
  const filteredListings = computed(() => {
    let result = [...listings.value]

    if (selectedCategory.value && selectedCategory.value !== 'All') {
      result = result.filter(l => l.category === selectedCategory.value)
    }

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      )
    }

    if (locationFilter.value.trim()) {
      const loc = locationFilter.value.toLowerCase().trim()
      result = result.filter(l => l.location.toLowerCase().includes(loc))
    }

    return result
  })

  // Actions
  async function fetchListings() {
    if (isLoaded.value && listings.value.length > 0) return
    loading.value = true
    try {
      if (listings.value.length === 0) {
        listings.value = await marketplaceService.getListings()
      }
      isLoaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function fetchListingById(id: string) {
    loading.value = true
    try {
      // First check in-memory/hydrated listings
      let item = listings.value.find(l => l.id === id)
      if (!item) {
        item = await marketplaceService.getListingById(id)
      }
      currentListing.value = item || null
      return item
    } finally {
      loading.value = false
    }
  }

  async function fetchMyListings(sellerId: string = 'user-farmer-1') {
    loading.value = true
    try {
      if (myListings.value.length === 0) {
        myListings.value = await marketplaceService.getListingsBySeller(sellerId)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchMyOrders(buyerId: string = 'user-farmer-1') {
    loading.value = true
    try {
      if (myOrders.value.length === 0) {
        myOrders.value = await marketplaceService.getMyOrders(buyerId)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchSellerProfile(sellerId: string) {
    loading.value = true
    try {
      const seller = await marketplaceService.getSellerById(sellerId)
      const sellerListings = listings.value.filter(l => l.sellerId === sellerId)
      currentSeller.value = seller || null
      return { seller, sellerListings }
    } finally {
      loading.value = false
    }
  }

  async function addListing(listing: Omit<MarketplaceListing, 'id' | 'createdAt'>) {
    loading.value = true
    try {
      const newListing = await marketplaceService.createListing(listing)
      listings.value.unshift(newListing)
      myListings.value.unshift(newListing)
      return newListing
    } finally {
      loading.value = false
    }
  }

  async function placeOrder(order: Omit<MarketplaceOrder, 'id' | 'createdAt'>) {
    loading.value = true
    try {
      const newOrder = await marketplaceService.placeOrder(order)
      myOrders.value.unshift(newOrder)
      // Deduct available stock in listings state
      const l = listings.value.find(item => item.id === order.listingId)
      if (l) {
        l.quantityAvailable = Math.max(0, l.quantityAvailable - order.quantity)
        if (l.quantityAvailable === 0) {
          l.status = 'sold_out'
        }
      }
      return newOrder
    } finally {
      loading.value = false
    }
  }

  return {
    listings,
    myListings,
    myOrders,
    currentListing,
    currentSeller,
    selectedCategory,
    searchQuery,
    locationFilter,
    loading,
    isLoaded,
    filteredListings,
    fetchListings,
    fetchListingById,
    fetchMyListings,
    fetchMyOrders,
    fetchSellerProfile,
    addListing,
    placeOrder
  }
}, {
  persist: true
})
