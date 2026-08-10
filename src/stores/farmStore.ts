import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
import { farmService } from '@/services/farmService'

export const useFarmStore = defineStore('farm', () => {
  const farm = ref<Farm | null>(null)
  const units = ref<FarmUnit[]>([])
  const productionRecords = ref<ProductionRecord[]>([])
  const feedRecords = ref<FeedRecord[]>([])
  const mortalityRecords = ref<MortalityRecord[]>([])
  const healthRecords = ref<HealthRecord[]>([])
  const transactions = ref<Transaction[]>([])
  const alerts = ref<Alert[]>([])
  const loading = ref<boolean>(false)
  const isLoaded = ref<boolean>(false)

  // Get current date string in YYYY-MM-DD
  const todayStr = computed(() => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  })

  // Computed Key Indicators for Dashboard & Metrics
  const totalBirds = computed(() => {
    return units.value
      .filter(u => u.status === 'active')
      .reduce((sum, u) => sum + u.quantity, 0)
  })

  const eggsToday = computed(() => {
    const today = todayStr.value
    const todayRecs = productionRecords.value.filter(
      p => p.recordType === 'egg_count' && p.recordedAt === today
    )
    if (todayRecs.length > 0) {
      return todayRecs.reduce((sum, r) => sum + r.value, 0)
    }
    const latest = [...productionRecords.value]
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]
    return latest ? latest.value : 0
  })

  const mortalityToday = computed(() => {
    const today = todayStr.value
    const todayRecs = mortalityRecords.value.filter(m => m.recordedAt === today)
    if (todayRecs.length > 0) {
      return todayRecs.reduce((sum, r) => sum + r.quantity, 0)
    }
    const latestDate = [...mortalityRecords.value]
      .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]?.recordedAt
    if (!latestDate) return 0
    return mortalityRecords.value
      .filter(m => m.recordedAt === latestDate)
      .reduce((sum, r) => sum + r.quantity, 0)
  })

  const todayNet = computed(() => {
    const today = todayStr.value
    let todayTxs = transactions.value.filter(t => t.recordedAt === today)
    if (todayTxs.length === 0) {
      const latestDate = [...transactions.value]
        .sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))[0]?.recordedAt
      if (latestDate) {
        todayTxs = transactions.value.filter(t => t.recordedAt === latestDate)
      }
    }
    const income = todayTxs
      .filter(t => t.type === 'income' || t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = todayTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    return income - expense
  })

  const upcomingHealthEvents = computed(() => {
    return healthRecords.value.filter(h => h.nextDueDate)
  })

  const activeAlerts = computed(() => alerts.value)

  // Actions
  async function fetchFarmData() {
    if (isLoaded.value && farm.value && units.value.length > 0) return
    loading.value = true
    try {
      if (!farm.value) farm.value = await farmService.getFarm()
      if (units.value.length === 0) units.value = await farmService.getFarmUnits()
      if (productionRecords.value.length === 0) productionRecords.value = await farmService.getProductionRecords()
      if (feedRecords.value.length === 0) feedRecords.value = await farmService.getFeedRecords()
      if (mortalityRecords.value.length === 0) mortalityRecords.value = await farmService.getMortalityRecords()
      if (healthRecords.value.length === 0) healthRecords.value = await farmService.getHealthRecords()
      if (transactions.value.length === 0) transactions.value = await farmService.getTransactions()
      if (alerts.value.length === 0) alerts.value = await farmService.getAlerts()
      isLoaded.value = true
    } finally {
      loading.value = false
    }
  }

  async function addFarmUnit(unit: Omit<FarmUnit, 'id'>) {
    const newUnit = await farmService.createFarmUnit(unit)
    units.value.push(newUnit)
    return newUnit
  }

  async function addProductionRecord(record: Omit<ProductionRecord, 'id'>) {
    const newRecord = await farmService.createProductionRecord(record)
    productionRecords.value.push(newRecord)
    return newRecord
  }

  async function addFeedRecord(record: Omit<FeedRecord, 'id'>) {
    const newRecord = await farmService.createFeedRecord(record)
    feedRecords.value.push(newRecord)
    return newRecord
  }

  async function addMortalityRecord(record: Omit<MortalityRecord, 'id'>) {
    const newRecord = await farmService.createMortalityRecord(record)
    mortalityRecords.value.push(newRecord)
    return newRecord
  }

  async function addHealthRecord(record: Omit<HealthRecord, 'id'>) {
    const newRecord = await farmService.createHealthRecord(record)
    healthRecords.value.push(newRecord)
    return newRecord
  }

  async function addTransaction(tx: Omit<Transaction, 'id'>) {
    const newTx = await farmService.createTransaction(tx)
    transactions.value.push(newTx)
    return newTx
  }

  async function dismissAlert(id: string) {
    await farmService.dismissAlert(id)
    alerts.value = alerts.value.filter(a => a.id !== id)
  }

  return {
    farm,
    units,
    productionRecords,
    feedRecords,
    mortalityRecords,
    healthRecords,
    transactions,
    alerts,
    loading,
    isLoaded,
    todayStr,
    totalBirds,
    eggsToday,
    mortalityToday,
    todayNet,
    upcomingHealthEvents,
    activeAlerts,
    fetchFarmData,
    addFarmUnit,
    addProductionRecord,
    addFeedRecord,
    addMortalityRecord,
    addHealthRecord,
    addTransaction,
    dismissAlert
  }
}, {
  persist: true
})
