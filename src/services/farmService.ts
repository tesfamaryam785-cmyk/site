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
import {
  mockFarm,
  mockFarmUnits,
  mockProductionRecords,
  mockFeedRecords,
  mockMortalityRecords,
  mockHealthRecords,
  mockTransactions,
  mockAlerts
} from '@/mocks/farmData'

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms))

// Local mutable arrays initialized with mock data
let farmData: Farm = { ...mockFarm }
let unitsData: FarmUnit[] = [...mockFarmUnits]
let productionData: ProductionRecord[] = [...mockProductionRecords]
let feedData: FeedRecord[] = [...mockFeedRecords]
let mortalityData: MortalityRecord[] = [...mockMortalityRecords]
let healthData: HealthRecord[] = [...mockHealthRecords]
let transactionData: Transaction[] = [...mockTransactions]
let alertData: Alert[] = [...mockAlerts]

export const farmService = {
  async getFarm(): Promise<Farm> {
    await delay()
    return { ...farmData }
  },

  async getFarmUnits(farmId?: string): Promise<FarmUnit[]> {
    await delay()
    if (!farmId) return [...unitsData]
    return unitsData.filter(u => u.farmId === farmId)
  },

  async createFarmUnit(unit: Omit<FarmUnit, 'id'>): Promise<FarmUnit> {
    await delay()
    const newUnit: FarmUnit = {
      id: `unit-${Math.random().toString(36).substring(2, 9)}`,
      ...unit
    }
    unitsData.push(newUnit)
    return newUnit
  },

  async getProductionRecords(unitId?: string): Promise<ProductionRecord[]> {
    await delay()
    if (!unitId) return [...productionData]
    return productionData.filter(p => p.farmUnitId === unitId)
  },

  async createProductionRecord(record: Omit<ProductionRecord, 'id'>): Promise<ProductionRecord> {
    await delay()
    const newRecord: ProductionRecord = {
      id: `prod-${Math.random().toString(36).substring(2, 9)}`,
      ...record
    }
    productionData.push(newRecord)
    return newRecord
  },

  async getFeedRecords(unitId?: string): Promise<FeedRecord[]> {
    await delay()
    if (!unitId) return [...feedData]
    return feedData.filter(f => f.farmUnitId === unitId)
  },

  async createFeedRecord(record: Omit<FeedRecord, 'id'>): Promise<FeedRecord> {
    await delay()
    const newRecord: FeedRecord = {
      id: `feed-${Math.random().toString(36).substring(2, 9)}`,
      ...record
    }
    feedData.push(newRecord)
    return newRecord
  },

  async getMortalityRecords(unitId?: string): Promise<MortalityRecord[]> {
    await delay()
    if (!unitId) return [...mortalityData]
    return mortalityData.filter(m => m.farmUnitId === unitId)
  },

  async createMortalityRecord(record: Omit<MortalityRecord, 'id'>): Promise<MortalityRecord> {
    await delay()
    const newRecord: MortalityRecord = {
      id: `mort-${Math.random().toString(36).substring(2, 9)}`,
      ...record
    }
    mortalityData.push(newRecord)
    return newRecord
  },

  async getHealthRecords(unitId?: string): Promise<HealthRecord[]> {
    await delay()
    if (!unitId) return [...healthData]
    return healthData.filter(h => h.farmUnitId === unitId)
  },

  async createHealthRecord(record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> {
    await delay()
    const newRecord: HealthRecord = {
      id: `hlth-${Math.random().toString(36).substring(2, 9)}`,
      ...record
    }
    healthData.push(newRecord)
    return newRecord
  },

  async getTransactions(farmId?: string): Promise<Transaction[]> {
    await delay()
    if (!farmId) return [...transactionData]
    return transactionData.filter(t => t.farmId === farmId)
  },

  async createTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay()
    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).substring(2, 9)}`,
      ...tx
    }
    transactionData.push(newTx)
    return newTx
  },

  async getAlerts(farmId?: string): Promise<Alert[]> {
    await delay()
    if (!farmId) return [...alertData]
    return alertData.filter(a => a.farmId === farmId)
  },

  async dismissAlert(id: string): Promise<boolean> {
    await delay()
    alertData = alertData.filter(a => a.id !== id)
    return true
  }
}
