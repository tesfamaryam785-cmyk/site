<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import StatCard from '@/components/ui/StatCard.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'
import { useToast } from '@/composables/useToast'
import { useThemeStore } from '@/stores/theme'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

import {
  Wheat,
  Droplets,
  Tractor,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Sliders,
  AlertTriangle
} from 'lucide-vue-next'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const toast = useToast()
const themeStore = useThemeStore()

// State for interactive UI demo controls
const isModalOpen = ref(false)
const sampleInputValue = ref('Valley Sector B Field 2')
const sampleSelectValue = ref('wheat')
const sampleNumberValue = ref(150)
const isButtonLoading = ref(false)
const showSkeletons = ref(false)

const cropOptions = [
  { label: 'Organic Wheat (Hard Red)', value: 'wheat' },
  { label: 'Non-GMO Yellow Corn', value: 'corn' },
  { label: 'Soybeans Grade A', value: 'soybeans' },
  { label: 'Barley & Oats Blend', value: 'barley' }
]

function toggleLoadingState() {
  isButtonLoading.value = true
  setTimeout(() => {
    isButtonLoading.value = false
    toast.success('Action Complete', 'Background task finalized successfully.')
  }, 2000)
}

function triggerToasts() {
  toast.success('Harvest Record Saved', 'Yield updated to 4,250 kg for Sector 4.')
  setTimeout(() => {
    toast.warning('Low Irrigation Pressure', 'Sector 2 water flow dropped below 30 PSI.')
  }, 400)
  setTimeout(() => {
    toast.error('Livestock Alert', 'Fence perimeter breach detected in Pasture C.', 6000)
  }, 800)
}

// Chart configuration for ECharts demo
const chartOption = ref({
  color: ['#2D5A3D', '#C4653C'],
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
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLabel: { color: '#6B7280', fontSize: 13, fontWeight: 'bold' }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#6B7280', fontSize: 13 }
  },
  series: [
    {
      name: 'Soil Moisture %',
      type: 'line',
      smooth: true,
      data: [62, 65, 68, 74, 70, 68, 72],
      lineStyle: { width: 3 }
    },
    {
      name: 'Temperature (°C)',
      type: 'line',
      smooth: true,
      data: [22, 24, 27, 25, 23, 21, 26],
      lineStyle: { width: 3 }
    }
  ]
})
</script>

<template>
  <div class="space-y-10">
    <!-- Header Banner -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 text-white p-6 md:p-8 rounded-2xl shadow-md">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider">
          <Sparkles class="w-4 h-4" /> Design System Showcase
        </div>
        <h1 class="text-3xl md:text-4xl font-extrabold font-heading tracking-tight">
          Alazar-Agri
        </h1>
        <p class="text-white/90 text-base md:text-lg max-w-2xl">
          High-contrast outdoor agricultural design system built with Vue 3, TypeScript, Vite, and Tailwind CSS 4.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <BaseButton variant="secondary" @click="themeStore.toggleTheme">
          <Sun v-if="themeStore.isDark" class="w-5 h-5 mr-2 text-amber-400" />
          <Moon v-else class="w-5 h-5 mr-2 text-primary-600" />
          <span>{{ themeStore.isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </BaseButton>
      </div>
    </div>

    <!-- Section 1: KPI Stat Cards -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        <Layers class="w-6 h-6 text-primary-500" />
        StatCard Component
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Acreage Under Irrigation"
          value="1,420"
          unit="acres"
          :trend="{ value: '+8.5%', direction: 'up', label: 'expansion' }"
        >
          <template #icon><Tractor class="w-6 h-6" /></template>
        </StatCard>

        <StatCard
          label="Active Crop Field Health Index"
          value="94.2"
          unit="NDVI"
          highlighted
          :trend="{ value: '+2.1%', direction: 'up', label: 'vs last week' }"
        >
          <template #icon><Wheat class="w-6 h-6" /></template>
        </StatCard>

        <StatCard
          label="Water Reserve Level"
          value="45,000"
          unit="L"
          :trend="{ value: '-3.2%', direction: 'down', label: 'dry spell warning' }"
        >
          <template #icon><Droplets class="w-6 h-6" /></template>
        </StatCard>
      </div>
    </section>

    <!-- Section 2: Buttons & Interactive Controls -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        <Sliders class="w-6 h-6 text-accent-500" />
        BaseButton Variants & Touch Targets
      </h2>

      <BaseCard>
        <div class="space-y-6">
          <div class="flex flex-wrap items-center gap-4">
            <BaseButton variant="primary" @click="toast.success('Primary Clicked', 'Saved successfully!')">
              Primary Button
            </BaseButton>
            <BaseButton variant="secondary" @click="toast.info('Secondary Clicked')">
              Secondary Button
            </BaseButton>
            <BaseButton variant="ghost" @click="toast.info('Ghost Clicked')">
              Ghost Button
            </BaseButton>
            <BaseButton variant="danger" @click="toast.error('Danger Action Triggered')">
              Muted Danger Button
            </BaseButton>
          </div>

          <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <BaseButton variant="primary" size="lg">
              Large Touch Target (52px)
            </BaseButton>
            <BaseButton variant="primary" :loading="isButtonLoading" @click="toggleLoadingState">
              Click to Test Loading State
            </BaseButton>
            <BaseButton variant="secondary" disabled>
              Disabled State
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </section>

    <!-- Section 3: Form Elements & Field Usability -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        Form Inputs (Large Touch Targets & Sunlight Usability)
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BaseCard>
          <BaseInput
            v-model="sampleInputValue"
            label="Field Parcel Name"
            hint="Min font size 16px for bright sunlight reading"
            required
          />
        </BaseCard>

        <BaseCard>
          <BaseSelect
            v-model="sampleSelectValue"
            label="Selected Crop Rotation"
            :options="cropOptions"
            hint="Custom high-contrast dropdown"
            required
          />
        </BaseCard>

        <BaseCard>
          <BaseNumberInput
            v-model="sampleNumberValue"
            label="Fertilizer Application Rate"
            unit="kg / hectare"
            :min="0"
            :max="500"
            :step="25"
            hint="Large + / - buttons for field gloves"
          />
        </BaseCard>
      </div>
    </section>

    <!-- Section 4: Status Badges -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        BaseBadge Status Tags
      </h2>

      <BaseCard>
        <div class="flex flex-wrap items-center gap-4">
          <BaseBadge variant="active">Active System</BaseBadge>
          <BaseBadge variant="success">Yield Target Met</BaseBadge>
          <BaseBadge variant="low-stock">Low Fuel Reserve</BaseBadge>
          <BaseBadge variant="warning">Inspection Scheduled</BaseBadge>
          <BaseBadge variant="overdue">Overdue Vaccination</BaseBadge>
          <BaseBadge variant="danger">Critical Temperature</BaseBadge>
          <BaseBadge variant="info">Telemetry Syncing</BaseBadge>
          <BaseBadge variant="neutral">Offline Mode</BaseBadge>
        </div>
      </BaseCard>
    </section>

    <!-- Section 5: BaseCard Highlighted & Normal States -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        BaseCard Variants
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseCard>
          <template #header>
            <h3 class="font-bold text-lg">Standard BaseCard</h3>
          </template>
          <p class="text-stone-700 dark:text-stone-300">
            Soft shadow, `rounded-xl`, high contrast border (`border-stone-200` in light mode, `border-stone-800` in dark mode).
          </p>
        </BaseCard>

        <BaseCard highlighted highlight-variant="accent">
          <template #header>
            <h3 class="font-bold text-lg text-accent-700 dark:text-accent-300">Highlighted BaseCard (Clay Accent)</h3>
          </template>
          <p class="text-stone-800 dark:text-stone-200">
            Used to draw focus to critical financial summaries or priority farm operational alerts without using jarring bright background colors.
          </p>
        </BaseCard>
      </div>
    </section>

    <!-- Section 6: Modal, Toast & Skeleton State Controls -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        <Bell class="w-6 h-6 text-primary-500" />
        Interactive Modal, Toast Stack & Skeleton Loader
      </h2>

      <BaseCard>
        <div class="flex flex-wrap items-center gap-4">
          <BaseButton variant="primary" @click="isModalOpen = true">
            Open Interactive Modal
          </BaseButton>

          <BaseButton variant="secondary" @click="triggerToasts">
            Trigger Stacked Toasts
          </BaseButton>

          <BaseButton variant="ghost" @click="showSkeletons = !showSkeletons">
            Toggle Skeletons: {{ showSkeletons ? 'ON' : 'OFF' }}
          </BaseButton>
        </div>

        <div v-if="showSkeletons" class="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-4">
          <h4 class="font-bold text-base text-stone-700 dark:text-stone-300">Skeleton Loader Showcase (No Spinners):</h4>
          <SkeletonLoader variant="circle" />
          <SkeletonLoader variant="text" :count="2" />
          <SkeletonLoader variant="card" />
        </div>
      </BaseCard>
    </section>

    <!-- Section 7: vue-echarts Telemetry Demonstration -->
    <section class="space-y-4">
      <h2 class="text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        vue-echarts High-Contrast Telemetry Chart
      </h2>

      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-lg">7-Day Soil Moisture vs Ambient Temperature</h3>
            <BaseBadge variant="active">Live Telemetry</BaseBadge>
          </div>
        </template>

        <div class="h-80 w-full">
          <v-chart class="chart" :option="chartOption" autofocus />
        </div>
      </BaseCard>
    </section>

    <!-- Demo Modal -->
    <BaseModal
      :show="isModalOpen"
      title="Field Operation Confirmation"
      @close="isModalOpen = false"
    >
      <div class="space-y-4">
        <p class="text-base text-stone-800 dark:text-stone-200">
          Are you sure you want to execute automated drip irrigation for <strong>Valley Sector B</strong> at 150 kg/ha rate?
        </p>
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-sm font-medium">
          <AlertTriangle class="w-5 h-5 shrink-0 mt-0.5" />
          <span>High temperature expected tomorrow afternoon. Irrigation timed for optimal soil absorption.</span>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="ghost" @click="isModalOpen = false">
          Cancel
        </BaseButton>
        <BaseButton variant="primary" @click="isModalOpen = false; toast.success('Irrigation Initiated', 'Sector B pumps activated.')">
          Confirm Irrigation
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
