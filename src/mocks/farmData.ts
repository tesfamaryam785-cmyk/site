import type {
  Farm,
  FarmUnit,
  ProductionRecord,
  FeedRecord,
  MortalityRecord,
  HealthRecord,
  Transaction,
  Alert
} from '@/types'

export const mockFarm: Farm = {
  id: 'farm-1',
  ownerId: 'user-farmer-1',
  name: 'Bishoftu Layers Farm',
  location: 'Bishoftu (Debre Zeit), Oromia Region',
  farmTypes: ['Poultry']
}

export const mockFarmUnits: FarmUnit[] = [
  {
    id: 'unit-flock-a',
    farmId: 'farm-1',
    unitType: 'poultry_flock',
    species: 'Bovans Brown (Layer)',
    label: 'Flock A - Bovans Brown Layers',
    quantity: 500,
    startDate: '2026-01-15',
    status: 'active'
  },
  {
    id: 'unit-flock-b',
    farmId: 'farm-1',
    unitType: 'poultry_flock',
    species: 'Sasso T44 (Dual Purpose)',
    label: 'Flock B - Sasso T44 Broilers',
    quantity: 300,
    startDate: '2026-02-01',
    status: 'active'
  }
]

export const mockProductionRecords: ProductionRecord[] = [
  { id: 'prod-1', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 420, unit: 'eggs', recordedAt: '2026-07-26' },
  { id: 'prod-2', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 435, unit: 'eggs', recordedAt: '2026-07-27' },
  { id: 'prod-3', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 428, unit: 'eggs', recordedAt: '2026-07-28' },
  { id: 'prod-4', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 442, unit: 'eggs', recordedAt: '2026-07-29' },
  { id: 'prod-5', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 450, unit: 'eggs', recordedAt: '2026-07-30' },
  { id: 'prod-6', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 438, unit: 'eggs', recordedAt: '2026-07-31' },
  { id: 'prod-7', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 460, unit: 'eggs', recordedAt: '2026-08-01' },
  { id: 'prod-8', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 445, unit: 'eggs', recordedAt: '2026-08-02' },
  { id: 'prod-9', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 430, unit: 'eggs', recordedAt: '2026-08-03' },
  { id: 'prod-10', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 452, unit: 'eggs', recordedAt: '2026-08-04' },
  { id: 'prod-11', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 448, unit: 'eggs', recordedAt: '2026-08-05' },
  { id: 'prod-12', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 455, unit: 'eggs', recordedAt: '2026-08-06' },
  { id: 'prod-13', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 440, unit: 'eggs', recordedAt: '2026-08-07' },
  { id: 'prod-14', farmUnitId: 'unit-flock-a', recordType: 'egg_count', value: 458, unit: 'eggs', recordedAt: '2026-08-08' }
]

export const mockFeedRecords: FeedRecord[] = [
  { id: 'feed-1', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 58, cost: 348.00, recordedAt: '2026-07-26' },
  { id: 'feed-2', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 60, cost: 360.00, recordedAt: '2026-07-27' },
  { id: 'feed-3', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 57, cost: 342.00, recordedAt: '2026-07-28' },
  { id: 'feed-4', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 62, cost: 372.00, recordedAt: '2026-07-29' },
  { id: 'feed-5', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 60, cost: 360.00, recordedAt: '2026-07-30' },
  { id: 'feed-6', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 59, cost: 354.00, recordedAt: '2026-07-31' },
  { id: 'feed-7', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 61, cost: 366.00, recordedAt: '2026-08-01' },
  { id: 'feed-8', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 60, cost: 360.00, recordedAt: '2026-08-02' },
  { id: 'feed-9', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 58, cost: 348.00, recordedAt: '2026-08-03' },
  { id: 'feed-10', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 62, cost: 372.00, recordedAt: '2026-08-04' },
  { id: 'feed-11', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 60, cost: 360.00, recordedAt: '2026-08-05' },
  { id: 'feed-12', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 63, cost: 378.00, recordedAt: '2026-08-06' },
  { id: 'feed-13', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 60, cost: 360.00, recordedAt: '2026-08-07' },
  { id: 'feed-14', farmUnitId: 'unit-flock-a', feedType: 'Noug Seed Cake & Layer Mash Blend', quantityKg: 61, cost: 366.00, recordedAt: '2026-08-08' }
]

export const mockMortalityRecords: MortalityRecord[] = [
  { id: 'mort-1', farmUnitId: 'unit-flock-a', quantity: 2, cause: 'heat stress', recordedAt: '2026-08-02' },
  { id: 'mort-2', farmUnitId: 'unit-flock-a', quantity: 1, cause: 'pecking injury', recordedAt: '2026-08-04' },
  { id: 'mort-3', farmUnitId: 'unit-flock-b', quantity: 1, cause: 'unknown', recordedAt: '2026-08-06' },
  { id: 'mort-4', farmUnitId: 'unit-flock-b', quantity: 1, cause: 'heat stress', recordedAt: '2026-08-08' }
]

export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'hlth-1',
    farmUnitId: 'unit-flock-a',
    recordType: 'vaccination',
    name: 'Newcastle Disease Vaccine (LaSota)',
    dose: '1 vial / 1000 doses',
    cost: 240.00,
    nextDueDate: '2026-08-11',
    recordedAt: '2026-07-10'
  },
  {
    id: 'hlth-2',
    farmUnitId: 'unit-flock-a',
    recordType: 'vaccination',
    name: 'Infectious Bronchitis (H120)',
    dose: '1 vial / 500 doses',
    cost: 185.00,
    nextDueDate: '2026-08-18',
    recordedAt: '2026-07-20'
  },
  {
    id: 'hlth-3',
    farmUnitId: 'unit-flock-a',
    recordType: 'medication',
    name: 'Multivitamin & Electrolytes Water Soluble',
    dose: '100g per 200L water',
    cost: 120.00,
    recordedAt: '2026-08-01'
  },
  {
    id: 'hlth-4',
    farmUnitId: 'unit-flock-b',
    recordType: 'vaccination',
    name: 'Gumboro (IBD) Booster',
    dose: '1 vial / 500 doses',
    cost: 220.00,
    nextDueDate: '2026-08-11',
    recordedAt: '2026-07-15'
  },
  {
    id: 'hlth-5',
    farmUnitId: 'unit-flock-a',
    recordType: 'vaccination',
    name: 'Fowl Pox Vaccine Wing Web',
    dose: '1 needle applicator',
    cost: 300.00,
    nextDueDate: '2026-08-18',
    recordedAt: '2026-06-18'
  }
]

export const mockTransactions: Transaction[] = [
  { id: 'tx-1', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2250.00, description: 'Wholesale sale: 50 egg trays @ 45 Birr/tray', recordedAt: '2026-07-26' },
  { id: 'tx-2', farmId: 'farm-1', type: 'expense', category: 'feed', amount: 3480.00, description: 'Noug Seed Cake & Layer Mash 10 x 50kg bags', recordedAt: '2026-07-27' },
  { id: 'tx-3', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2475.00, description: 'Wholesale sale: 55 egg trays to Merkato buyer', recordedAt: '2026-07-28' },
  { id: 'tx-4', farmId: 'farm-1', type: 'expense', category: 'medication', amount: 450.00, description: 'Gumboro vaccine & vitamins from Bishoftu Vet Depot', recordedAt: '2026-07-29' },
  { id: 'tx-5', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2340.00, description: 'Local Bishoftu market egg delivery', recordedAt: '2026-07-30' },
  { id: 'tx-6', farmId: 'farm-1', type: 'expense', category: 'labor', amount: 1500.00, description: 'Weekly farm worker wages', recordedAt: '2026-07-31' },
  { id: 'tx-7', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2520.00, description: 'Wholesale sale: 56 egg trays to Adama trader', recordedAt: '2026-08-01' },
  { id: 'tx-8', farmId: 'farm-1', type: 'sale', category: 'bird sales', amount: 3500.00, description: 'Advance payment: 30 Sasso broilers pre-order', recordedAt: '2026-08-02' },
  { id: 'tx-9', farmId: 'farm-1', type: 'expense', category: 'equipment', amount: 850.00, description: 'Solar pump valve repair in Bishoftu', recordedAt: '2026-08-03' },
  { id: 'tx-10', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2385.00, description: 'Wholesale sale: 53 egg trays to Hawassa hotel', recordedAt: '2026-08-04' },
  { id: 'tx-11', farmId: 'farm-1', type: 'expense', category: 'feed', amount: 3600.00, description: 'Broiler finisher feed bulk order Akaki Feed', recordedAt: '2026-08-05' },
  { id: 'tx-12', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2430.00, description: 'Wholesale sale: 54 egg trays', recordedAt: '2026-08-06' },
  { id: 'tx-13', farmId: 'farm-1', type: 'expense', category: 'labor', amount: 1500.00, description: 'Weekly farm worker wages', recordedAt: '2026-08-07' },
  { id: 'tx-14', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 2610.00, description: 'Wholesale sale: 58 egg trays @ 45 Birr/tray', recordedAt: '2026-08-08' },
  { id: 'tx-15', farmId: 'farm-1', type: 'expense', category: 'feed', amount: 366.00, description: 'Daily Noug Cake & Layer Mash Feed cost', recordedAt: '2026-08-08' },
  { id: 'tx-16', farmId: 'farm-1', type: 'expense', category: 'other', amount: 350.00, description: 'Water purification filter replacement', recordedAt: '2026-08-08' },
  { id: 'tx-17', farmId: 'farm-1', type: 'income', category: 'other', amount: 1200.00, description: 'Organic poultry manure compost sale', recordedAt: '2026-08-07' },
  { id: 'tx-18', farmId: 'farm-1', type: 'sale', category: 'egg sales', amount: 1800.00, description: 'Direct farm gate egg sales in Bishoftu', recordedAt: '2026-08-08' }
]

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    farmId: 'farm-1',
    severity: 'critical',
    message: 'Mortality in Flock B (Sasso T44) is above normal today — inspect Shed 2 ventilation and clean water nipples.',
    actionLabel: 'Inspect Shed 2',
    actionRoute: '/farm/mortality',
    createdAt: '2026-08-08T08:30:00Z'
  },
  {
    id: 'alert-2',
    farmId: 'farm-1',
    severity: 'warning',
    message: 'Newcastle Booster vaccination due in 3 days for Flock A (Bovans Brown).',
    actionLabel: 'Log Vaccination',
    actionRoute: '/farm/health',
    createdAt: '2026-08-08T07:15:00Z'
  },
  {
    id: 'alert-3',
    farmId: 'farm-1',
    severity: 'warning',
    message: 'Noug Cake & Layer Mash feed reserve is below 4-day safety threshold in Bishoftu store.',
    actionLabel: 'Reorder Feed',
    actionRoute: '/farm/feed',
    createdAt: '2026-08-07T16:00:00Z'
  },
  {
    id: 'alert-4',
    farmId: 'farm-1',
    severity: 'info',
    message: 'Egg production lay rate increased by +5.2% following Noug cake ratio adjustment.',
    actionLabel: 'View Production',
    actionRoute: '/farm/production',
    createdAt: '2026-08-06T12:00:00Z'
  }
]
