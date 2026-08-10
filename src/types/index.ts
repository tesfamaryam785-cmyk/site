export interface Farm {
  id: string
  ownerId: string
  name: string
  location: string
  farmTypes: string[]
}

export interface FarmUnit {
  id: string
  farmId: string
  unitType: string // e.g. "poultry_flock", "dairy_herd"
  species: string  // e.g. "layer_chicken", "broiler"
  label: string    // e.g. "Flock A - Layers"
  quantity: number
  startDate: string
  status: 'active' | 'inactive' | 'archived'
}

export interface ProductionRecord {
  id: string
  farmUnitId: string
  recordType: string // e.g. "egg_count", "milk_liters"
  value: number
  unit: string
  recordedAt: string
}

export interface FeedRecord {
  id: string
  farmUnitId: string
  feedType: string
  quantityKg: number
  cost: number
  recordedAt: string
}

export interface MortalityRecord {
  id: string
  farmUnitId: string
  quantity: number
  cause: string
  recordedAt: string
}

export interface HealthRecord {
  id: string
  farmUnitId: string
  recordType: 'vaccination' | 'medication'
  name: string
  dose: string
  cost: number
  nextDueDate?: string
  recordedAt: string
}

export interface Transaction {
  id: string
  farmId: string
  type: 'expense' | 'income' | 'sale'
  category: string
  amount: number
  description: string
  recordedAt: string
}

export interface Alert {
  id: string
  farmId: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  actionLabel?: string
  actionRoute?: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  phone: string
  email: string
  role: 'farmer' | 'buyer' | 'supplier' | 'distributor' | 'hatchery' | 'feed_company'
}

export interface MarketplaceListing {
  id: string
  sellerId: string
  sellerName: string
  sellerRole: User['role']
  category: string
  title: string
  description: string
  price: number
  unit: string
  quantityAvailable: number
  images: string[]
  location: string
  status: 'active' | 'sold_out' | 'paused'
  createdAt: string
}

export interface MarketplaceOrder {
  id: string
  listingId: string
  listingTitle?: string
  buyerId: string
  sellerId: string
  sellerName?: string
  quantity: number
  totalPrice: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}
