import type { User, MarketplaceListing, MarketplaceOrder } from '@/types'
import { mockListings, mockOrders, mockSellers } from '@/mocks/marketplaceData'

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

let listingsData: MarketplaceListing[] = [...mockListings]
let ordersData: MarketplaceOrder[] = [...mockOrders]
let sellersData: User[] = [...mockSellers]

export const marketplaceService = {
  async getListings(filters?: { category?: string; search?: string; location?: string }): Promise<MarketplaceListing[]> {
    await delay()
    let result = [...listingsData]

    if (filters?.category && filters.category !== 'All') {
      result = result.filter(l => l.category === filters.category)
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q)
      )
    }

    if (filters?.location) {
      const loc = filters.location.toLowerCase()
      result = result.filter(l => l.location.toLowerCase().includes(loc))
    }

    return result
  },

  async getListingById(id: string): Promise<MarketplaceListing | undefined> {
    await delay()
    return listingsData.find(l => l.id === id)
  },

  async createListing(listing: Omit<MarketplaceListing, 'id' | 'createdAt'>): Promise<MarketplaceListing> {
    await delay()
    const newListing: MarketplaceListing = {
      id: `list-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...listing
    }
    listingsData.unshift(newListing)
    return newListing
  },

  async getListingsBySeller(sellerId: string): Promise<MarketplaceListing[]> {
    await delay()
    return listingsData.filter(l => l.sellerId === sellerId)
  },

  async placeOrder(order: Omit<MarketplaceOrder, 'id' | 'createdAt'>): Promise<MarketplaceOrder> {
    await delay()
    const newOrder: MarketplaceOrder = {
      id: `order-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      ...order
    }
    ordersData.unshift(newOrder)

    // Deduct quantity available from listing
    const listing = listingsData.find(l => l.id === order.listingId)
    if (listing) {
      listing.quantityAvailable = Math.max(0, listing.quantityAvailable - order.quantity)
      if (listing.quantityAvailable === 0) {
        listing.status = 'sold_out'
      }
    }

    return newOrder
  },

  async getMyOrders(buyerId: string = 'user-farmer-1'): Promise<MarketplaceOrder[]> {
    await delay()
    return ordersData.filter(o => o.buyerId === buyerId)
  },

  async getSellerById(sellerId: string): Promise<User | undefined> {
    await delay()
    return sellersData.find(s => s.id === sellerId)
  }
}
