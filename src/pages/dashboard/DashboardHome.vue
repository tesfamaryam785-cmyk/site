<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFarmStore } from '@/stores/farmStore'
import BaseCard from '@/components/ui/BaseCard.vue'
import StatCard from '@/components/ui/StatCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

import {
  Bell,
  AlertTriangle,
  Info,
  AlertCircle,
  Tractor,
  TrendingUp,
  ChevronRight,
  Egg,
  Wheat,
  Activity,
  DollarSign
} from 'lucide-vue-next'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const farmStore = useFarmStore()
const router = useRouter()

const activeChartTab = ref<'production' | 'feed'>('production')

// Count-up animation reactive targets
const displayTotalBirds = ref(0)
const displayEggsToday = ref(0)
const displayMortalityToday = ref(0)
const displayTodayNet = ref(0)

function animateCountUp(targetVal: number, reactiveRef: typeof displayTotalBirds, duration = 800) {
  const start = reactiveRef.value
  const startTime = performance.now()
  function step(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    reactiveRef.value = Math.floor(start + (targetVal - start) * progress)
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      reactiveRef.value = targetVal
    }
  }
  requestAnimationFrame(step)
}

onMounted(async () => {
  await farmStore.fetchFarmData()
  animateCountUp(farmStore.totalBirds, displayTotalBirds)
  animateCountUp(farmStore.eggsToday, displayEggsToday)
  animateCountUp(farmStore.mortalityToday, displayMortalityToday)
  animateCountUp(farmStore.todayNet, displayTodayNet)
})

watch(() => farmStore.totalBirds, (val) => animateCountUp(val, displayTotalBirds))
watch(() => farmStore.eggsToday, (val) => animateCountUp(val, displayEggsToday))
watch(() => farmStore.mortalityToday, (val) => animateCountUp(val, displayMortalityToday))
watch(() => farmStore.todayNet, (val) => animateCountUp(val, displayTodayNet))

// ECharts production trend line option computed from store
const productionChartOption = computed(() => {
  const records = [...farmStore.productionRecords]
    .filter(p => p.recordType === 'egg_count')
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))

  const dates = records.map(r => {
    const parts = r.recordedAt.split('-')
    return `${parts[1]}/${parts[2]}`
  })
  const counts = records.map(r => r.value)

  return {
    color: ['#2D5A3D'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#212421',
      borderColor: '#2E332E',
      textStyle: { color: '#F3F4F3', fontSize: 14 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates.length > 0 ? dates : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: { color: '#6B7280', fontSize: 12, fontWeight: 'bold' }
    },
    yAxis: {
      type: 'value',
      min: 350,
      axisLabel: { color: '#6B7280', fontSize: 12 }
    },
    series: [
      {
        name: 'Eggs Collected',
        type: 'line',
        smooth: true,
        data: counts.length > 0 ? counts : [420, 435, 428, 442, 450, 438, 458],
        lineStyle: { width: 3.5, color: '#2D5A3D' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(45, 90, 61, 0.35)' },
              { offset: 1, color: 'rgba(45, 90, 61, 0.02)' }
            ]
          }
        }
      }
    ]
  }
})

// ECharts feed cost trend option computed from store
const feedChartOption = computed(() => {
  const records = [...farmStore.feedRecords]
    .sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))

  const dates = records.map(r => {
    const parts = r.recordedAt.split('-')
    return `${parts[1]}/${parts[2]}`
  })
  const costs = records.map(r => r.cost)

  return {
    color: ['#C4653C'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#212421',
      borderColor: '#2E332E',
      textStyle: { color: '#F3F4F3', fontSize: 14 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: { color: '#6B7280', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#6B7280', fontSize: 11 }
    },
    series: [
      {
        name: 'Daily Feed Cost (Birr)',
        type: 'bar',
        barWidth: '50%',
        data: costs,
        itemStyle: { borderRadius: [4, 4, 0, 0], color: '#C4653C' }
      }
    ]
  }
})

function getAlertBorderClass(severity: string) {
  switch (severity) {
    case 'critical':
      return 'border-l-4 border-l-danger-500 bg-red-50/60 dark:bg-red-950/20'
    case 'warning':
      return 'border-l-4 border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20'
    case 'info':
    default:
      return 'border-l-4 border-l-sky-500 bg-sky-50/60 dark:bg-sky-950/20'
  }
}

function handleAlertAction(route?: string) {
  if (route) {
    router.push(route)
  }
}

function calculateDaysActive(startDateStr: string) {
  const start = new Date(startDateStr).getTime()
  const now = new Date().getTime()
  const diffDays = Math.floor((now - start) / (1000 * 3600 * 24))
  return diffDays > 0 ? diffDays : 1
}
</script>

<template>
  <div class="space-y-8 md:space-y-10">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
          Farm Operational Dashboard
        </h1>
        <p class="text-stone-600 dark:text-stone-400 mt-1 text-base">
          {{ farmStore.farm?.name || 'Green Valley Poultry Farm' }} • {{ farmStore.farm?.location || 'Rift Valley' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <BaseBadge variant="active" size="md">
          Telemetry Active
        </BaseBadge>
      </div>
    </div>

    <!-- Skeleton Loading State -->
    <div v-if="farmStore.loading && !farmStore.isLoaded" class="space-y-6">
      <SkeletonLoader variant="card" />
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SkeletonLoader variant="button" :count="4" />
      </div>
      <SkeletonLoader variant="card" height="300px" />
    </div>

    <template v-else>
      <!-- PROMINENT ACTION-ORIENTED ALERTS -->
      <section v-if="farmStore.activeAlerts.length > 0" class="space-y-3">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Bell class="w-5 h-5 text-amber-500" />
            Actionable Farm Alerts
          </h2>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {{ farmStore.activeAlerts.length }} Priority Actions
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="alert in farmStore.activeAlerts"
            :key="alert.id"
            class="p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            :class="getAlertBorderClass(alert.severity)"
          >
            <div class="flex items-start gap-3">
              <AlertCircle v-if="alert.severity === 'critical'" class="w-6 h-6 text-danger-500 shrink-0 mt-0.5" />
              <AlertTriangle v-else-if="alert.severity === 'warning'" class="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <Info v-else class="w-6 h-6 text-sky-500 shrink-0 mt-0.5" />

              <div class="space-y-0.5">
                <p class="font-bold text-stone-900 dark:text-stone-100 text-base leading-snug">
                  {{ alert.message }}
                </p>
                <span class="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Logged today • Agentic recommendation
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <BaseButton
                v-if="alert.actionLabel"
                :variant="alert.severity === 'critical' ? 'danger' : 'primary'"
                size="md"
                @click="handleAlertAction(alert.actionRoute)"
              >
                {{ alert.actionLabel }}
                <ChevronRight class="w-4 h-4 ml-1" />
              </BaseButton>

              <button
                type="button"
                @click="farmStore.dismissAlert(alert.id)"
                class="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 cursor-pointer"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 ANIMATED STAT CARDS -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Active Birds"
          :value="displayTotalBirds.toLocaleString()"
          unit="birds"
          :trend="{ value: '+0%', direction: 'neutral', label: 'stable' }"
        >
          <template #icon><Tractor class="w-6 h-6" /></template>
        </StatCard>

        <StatCard
          label="Eggs Collected Today"
          :value="displayEggsToday.toLocaleString()"
          unit="eggs"
          highlighted
          :trend="{ value: '+4.1%', direction: 'up', label: 'vs yesterday' }"
        >
          <template #icon><Egg class="w-6 h-6" /></template>
        </StatCard>

        <StatCard
          label="Mortality Today"
          :value="displayMortalityToday.toLocaleString()"
          unit="birds"
          :trend="{ value: '1 bird', direction: 'down', label: 'routine' }"
        >
          <template #icon><Activity class="w-6 h-6" /></template>
        </StatCard>

        <StatCard
          label="Today's Net Cashflow"
          :value="`${displayTodayNet.toLocaleString()} Birr`"
          :trend="{ value: '+185 Birr', direction: 'up', label: 'positive' }"
        >
          <template #icon><DollarSign class="w-6 h-6" /></template>
        </StatCard>
      </section>

      <!-- CONSOLIDATED DASHBOARD LAYOUT (2 Columns: Tabbed Telemetry Chart + Flocks List) -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- CONSOLIDATED TABBED CHART CARD (Spans 2 Columns) -->
        <BaseCard class="lg:col-span-2">
          <template #header>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <TrendingUp class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  14-Day Operational Telemetry
                </h3>
              </div>

              <!-- Tab Toggle for Production vs Feed Cost -->
              <div class="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <button
                  type="button"
                  @click="activeChartTab = 'production'"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  :class="[
                    activeChartTab === 'production'
                      ? 'bg-primary-500 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  ]"
                >
                  <Egg class="w-3.5 h-3.5" />
                  <span>Egg Yield</span>
                </button>

                <button
                  type="button"
                  @click="activeChartTab = 'feed'"
                  class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  :class="[
                    activeChartTab === 'feed'
                      ? 'bg-accent-500 text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  ]"
                >
                  <Wheat class="w-3.5 h-3.5" />
                  <span>Feed Cost (Birr)</span>
                </button>
              </div>
            </div>
          </template>

          <div class="h-72 w-full pt-2">
            <v-chart
              v-if="activeChartTab === 'production'"
              class="chart"
              :option="productionChartOption"
              autofocus
            />
            <v-chart
              v-else
              class="chart"
              :option="feedChartOption"
              autofocus
            />
          </div>
        </BaseCard>

        <!-- "Your Flocks" Summary Card (1 Column) -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold font-heading text-stone-900 dark:text-stone-100">
                Active Flocks
              </h3>
              <RouterLink to="/farm/flocks" class="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                Manage <ChevronRight class="w-4 h-4 ml-0.5" />
              </RouterLink>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="unit in farmStore.units"
              :key="unit.id"
              class="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-center justify-between"
            >
              <div>
                <h4 class="font-bold text-base text-stone-900 dark:text-stone-100">{{ unit.label }}</h4>
                <span class="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  {{ unit.species.replace('_', ' ') }}
                </span>
                <div class="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Active {{ calculateDaysActive(unit.startDate) }} days
                </div>
              </div>

              <div class="text-right">
                <span class="text-xl font-extrabold font-heading text-primary-600 dark:text-primary-400">
                  {{ unit.quantity }}
                </span>
                <div class="text-xs text-stone-500 font-semibold">birds</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </section>
    </template>
  </div>
</template>
