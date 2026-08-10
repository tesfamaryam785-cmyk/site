<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import { useThemeStore } from '@/stores/theme'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import BaseToast from '@/components/ui/BaseToast.vue'
import {
  Sprout,
  Tractor,
  ShoppingBag,
  Store,
  BarChart3,
  Bell,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
  Wheat,
  Lock,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-vue-next'

const marketplaceStore = useMarketplaceStore()
const themeStore = useThemeStore()
const router = useRouter()

const isLoginModalOpen = ref(false)
const modalRole = ref<'farmer' | 'buyer'>('farmer')
const activeWorkflow = ref<'farmer' | 'buyer'>('farmer')

onMounted(() => {
  themeStore.initTheme()
  marketplaceStore.fetchListings()
})

function openLogin(role: 'farmer' | 'buyer' = 'farmer') {
  modalRole.value = role
  isLoginModalOpen.value = true
}

function getSellerRoleBadge(role: string) {
  switch (role) {
    case 'farmer':
      return { label: 'Farmer', class: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200' }
    case 'feed_company':
      return { label: 'Feed Mill', class: 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200' }
    case 'hatchery':
      return { label: 'Hatchery', class: 'bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200' }
    case 'supplier':
    case 'distributor':
    default:
      return { label: 'Supplier', class: 'bg-sky-100 text-sky-950 border-sky-300 dark:bg-sky-950 dark:text-sky-200' }
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF7F2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200 selection:bg-emerald-700 selection:text-white flex flex-col justify-between">
    <!-- Navbar -->
    <nav class="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 border-b border-stone-200 dark:border-stone-800 shadow-2xs backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo -->
        <div @click="openLogin('farmer')" class="flex items-center gap-3.5 cursor-pointer">
          <div class="w-11 h-11 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/20">
            <Sprout class="w-6 h-6" />
          </div>
          <div class="flex flex-col">
            <span class="font-heading font-extrabold text-2xl text-emerald-900 dark:text-emerald-400 tracking-tight leading-none">
              Alazar-Agri
            </span>
            <span class="text-[11px] font-bold text-stone-500 dark:text-stone-400 tracking-wider mt-1 uppercase">
              እንኳን በደህና መጡ • Ethiopian Agricultural Platform
            </span>
          </div>
        </div>

        <!-- Nav Anchors -->
        <div class="hidden md:flex items-center gap-8 font-bold text-sm text-stone-700 dark:text-stone-300">
          <a href="#hero" class="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">Home</a>
          <a href="#how-it-works" class="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">Platform Scope</a>
          <a href="#marketplace" class="hover:text-emerald-800 dark:hover:text-emerald-400 transition-colors">Live Market</a>
        </div>

        <!-- Right Header Action (ALWAYS REQUIRES LOGIN) -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="themeStore.toggleTheme"
            class="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            aria-label="Toggle theme"
          >
            <Sun v-if="themeStore.isDark" class="w-5 h-5 text-amber-400" />
            <Moon v-else class="w-5 h-5 text-emerald-600" />
          </button>

          <BaseButton
            variant="ghost"
            size="md"
            class="hidden sm:inline-flex font-extrabold text-stone-800 dark:text-stone-200"
            @click="openLogin('farmer')"
          >
            Sign In
          </BaseButton>

          <BaseButton
            variant="primary"
            size="md"
            class="font-extrabold shadow-sm bg-emerald-800 hover:bg-emerald-900 text-white"
            @click="openLogin('farmer')"
          >
            Log In to Access
          </BaseButton>
        </div>
      </div>
    </nav>

    <!-- Main Platinum Landing Content -->
    <main class="flex-1 space-y-24 md:space-y-36">
      <!-- HERO SECTION -->
      <section id="hero" class="relative pt-10 md:pt-16 pb-12 overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <!-- Left Hero Text -->
            <div class="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-extrabold shadow-2xs">
                <ShieldCheck class="w-4 h-4 text-emerald-700" />
                <span>Verified Agricultural Network • Oromia & Amhara</span>
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight leading-[1.12]">
                Commercial Farm Management & Direct Trade.
              </h1>

              <p class="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-w-2xl mx-auto lg:mx-0">
                Log daily Bovans Brown layer yields, Noug cake feed rations, and farm profitability in Birr — while trading directly with verified hatcheries and feed mills across Bishoftu, Adama, & Addis Ababa.
              </p>

              <!-- Dual CTAs (Both Prompt Login) -->
              <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <BaseButton
                  variant="primary"
                  size="lg"
                  class="w-full sm:w-auto text-base font-extrabold py-4 px-8 shadow-md bg-emerald-800 hover:bg-emerald-900 text-white"
                  @click="openLogin('farmer')"
                >
                  <Tractor class="w-5 h-5 mr-2.5" />
                  Log In as Farmer (አርሶ አደር)
                </BaseButton>

                <BaseButton
                  variant="secondary"
                  size="lg"
                  class="w-full sm:w-auto text-base font-extrabold py-4 px-8 border-2 border-stone-300 dark:border-stone-700"
                  @click="openLogin('buyer')"
                >
                  <ShoppingBag class="w-5 h-5 mr-2.5" />
                  Log In as Buyer (ገዢ)
                </BaseButton>
              </div>

              <!-- Platinum Trust Markers -->
              <div class="pt-8 border-t border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-6 text-center lg:text-left">
                <div>
                  <div class="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-900 dark:text-emerald-400">Bishoftu</div>
                  <div class="text-xs text-stone-500 font-bold mt-1 uppercase tracking-wider">Poultry Operations</div>
                </div>
                <div>
                  <div class="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100">Birr (ETB)</div>
                  <div class="text-xs text-stone-500 font-bold mt-1 uppercase tracking-wider">Native Currency</div>
                </div>
                <div>
                  <div class="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-900 dark:text-emerald-400">Zero Fee</div>
                  <div class="text-xs text-stone-500 font-bold mt-1 uppercase tracking-wider">Farmer Smallholders</div>
                </div>
              </div>
            </div>

            <!-- Right Hero Card / Live Farm Showcase -->
            <div class="lg:col-span-5">
              <div class="relative rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-2xl space-y-6">
                <!-- Card Header -->
                <div class="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                      <Tractor class="w-5 h-5" />
                    </div>
                    <div>
                      <h3 class="font-extrabold text-base text-stone-900 dark:text-stone-100">Bishoftu Layers Farm</h3>
                      <p class="text-xs font-semibold text-stone-500">Debre Zeit, Oromia Region</p>
                    </div>
                  </div>
                  <BaseBadge variant="active" size="sm">ACTIVE SYSTEM</BaseBadge>
                </div>

                <!-- Real Farm Photo Banner -->
                <div class="relative h-48 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-2xs">
                  <img
                    src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80"
                    alt="Bovans Brown Poultry Farm"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs text-xs font-bold flex justify-between items-center shadow-xs">
                    <span class="text-stone-900 dark:text-stone-100">Bovans Brown Layer Hen Flock</span>
                    <span class="text-emerald-700 dark:text-emerald-400 font-extrabold">500 Pullets</span>
                  </div>
                </div>

                <!-- Daily Summary Snippet -->
                <div class="grid grid-cols-2 gap-3 pt-1">
                  <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Daily Egg Collection</span>
                    <div class="text-xl font-extrabold font-heading text-stone-900 dark:text-stone-100 mt-1">458 Eggs</div>
                    <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">91.6% Lay Rate</span>
                  </div>

                  <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">Today's Egg Revenue</span>
                    <div class="text-xl font-extrabold font-heading text-emerald-800 dark:text-emerald-400 mt-1">2,610 Birr</div>
                    <span class="text-[10px] font-bold text-stone-500">58 Trays @ 45 Birr</span>
                  </div>
                </div>

                <!-- Card Bottom CTA -->
                <BaseButton
                  variant="primary"
                  size="md"
                  class="w-full font-bold bg-emerald-800 hover:bg-emerald-900 text-white"
                  @click="openLogin('farmer')"
                >
                  <Lock class="w-4 h-4 mr-2" /> Log In to Access Full Dashboard
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PLATFORM SCOPE / HOW IT WORKS -->
      <section id="how-it-works" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div class="text-center max-w-3xl mx-auto space-y-3">
          <BaseBadge variant="active" size="md">FIELD USABILITY ARCHITECTURE</BaseBadge>
          <h2 class="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
            Comprehensive Platform Scope
          </h2>
          <p class="text-stone-600 dark:text-stone-400 text-base sm:text-lg">
            Purpose-built tools for high-sunlight outdoor field operations and direct commercial trade across Ethiopia.
          </p>

          <!-- Segmented Tab Controls -->
          <div class="inline-flex rounded-2xl bg-stone-200 dark:bg-stone-800 p-1.5 mt-4">
            <button
              type="button"
              @click="activeWorkflow = 'farmer'"
              class="px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2"
              :class="activeWorkflow === 'farmer' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              <Tractor class="w-4 h-4" />
              Farmer Workflows (አርሶ አደር)
            </button>
            <button
              type="button"
              @click="activeWorkflow = 'buyer'"
              class="px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2"
              :class="activeWorkflow === 'buyer' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              <ShoppingBag class="w-4 h-4" />
              Buyer & Supplier Trade (ገዢ)
            </button>
          </div>
        </div>

        <!-- Farmer Workflow Cards -->
        <div v-if="activeWorkflow === 'farmer'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Layers class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Daily Flock Telemetry
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Record daily egg collection counts, Noug seed cake feed rations (kg/cost), and flock mortality events with numeric tap controls.
            </p>
            <div class="pt-2">
              <button @click="openLogin('farmer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In to Track Flocks →
              </button>
            </div>
          </div>

          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Bell class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Vaccine & Feed Alerts
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Receive automatic alerts when Newcastle LaSota or Gumboro boosters are due, or when feed reserves drop below safety thresholds in Bishoftu.
            </p>
            <div class="pt-2">
              <button @click="openLogin('farmer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In for Alerts →
              </button>
            </div>
          </div>

          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-bold">
              <BarChart3 class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Financial Cashflow in Birr
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Track monthly egg sales against feed and labor expenses to understand net profit and exact production cost per tray in Birr.
            </p>
            <div class="pt-2">
              <button @click="openLogin('farmer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In to View Ledger →
              </button>
            </div>
          </div>
        </div>

        <!-- Buyer Workflow Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 flex items-center justify-center font-bold">
              <Store class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Verified Hatchery Supply
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Browse day-old Bovans Brown layer chicks, Sasso T44 dual-purpose birds, and Potchefstroom Koekoek pullets from certified hatcheries.
            </p>
            <div class="pt-2">
              <button @click="openLogin('buyer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In to Browse Hatcheries →
              </button>
            </div>
          </div>

          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Wheat class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Direct Feed Mill Purchasing
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Order 50kg layer mash, broiler finisher pellets, and pure Noug seed cake supplements directly from Akaki feed processors.
            </p>
            <div class="pt-2">
              <button @click="openLogin('buyer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In to Order Feed →
              </button>
            </div>
          </div>

          <div class="p-8 rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center font-bold">
              <ShoppingBag class="w-6 h-6" />
            </div>
            <h3 class="font-extrabold font-heading text-xl text-stone-900 dark:text-stone-100">
              Order Telemetry & Fulfillment
            </h3>
            <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Submit bulk purchases, view real-time toast notifications, and track completed order transactions inside your dedicated buyer dashboard.
            </p>
            <div class="pt-2">
              <button @click="openLogin('buyer')" class="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Log In to Manage Orders →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- LIVE MARKETPLACE CATALOG -->
      <section id="marketplace" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div class="space-y-2">
            <BaseBadge variant="active" size="md">LIVE CATALOG</BaseBadge>
            <h2 class="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
              Agricultural Marketplace Offers
            </h2>
            <p class="text-base text-stone-600 dark:text-stone-400">
              Real listing offers from Bishoftu hatcheries, Akaki feed mills, and Oromia egg producers.
            </p>
          </div>

          <button
            @click="openLogin('buyer')"
            class="inline-flex items-center text-base font-extrabold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Explore Full Marketplace (Requires Login)
            <ChevronRight class="w-5 h-5 ml-1" />
          </button>
        </div>

        <!-- 6 Real Product Cards (Clicking any card prompts Login Modal) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="listing in marketplaceStore.listings.slice(0, 6)"
            :key="listing.id"
            @click="openLogin('buyer')"
            class="group rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div class="relative h-48 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <img
                  :src="listing.images[0]"
                  :alt="listing.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute top-3 left-3">
                  <BaseBadge variant="neutral" size="sm">{{ listing.category }}</BaseBadge>
                </div>
                <div class="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/70 text-white">
                  <Lock class="w-3.5 h-3.5" />
                </div>
              </div>

              <div class="p-5 space-y-3">
                <h3 class="font-extrabold text-base sm:text-lg line-clamp-2 text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 transition-colors">
                  {{ listing.title }}
                </h3>

                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-extrabold font-heading text-emerald-800 dark:text-emerald-400">
                    {{ listing.price.toLocaleString() }} Birr
                  </span>
                  <span class="text-xs font-bold text-stone-500">/ {{ listing.unit }}</span>
                </div>

                <div class="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span class="font-extrabold text-stone-800 dark:text-stone-200 truncate max-w-[150px]">
                    {{ listing.sellerName }}
                  </span>
                  <span
                    class="px-2 py-0.5 rounded border text-[10px] font-extrabold uppercase"
                    :class="getSellerRoleBadge(listing.sellerRole).class"
                  >
                    {{ getSellerRoleBadge(listing.sellerRole).label }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 text-xs text-stone-500 pt-0.5">
                  <MapPin class="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  <span class="truncate">{{ listing.location }}</span>
                </div>
              </div>
            </div>

            <div class="p-4 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center text-xs">
              <span class="text-stone-500 font-bold">Qty: {{ listing.quantityAvailable }} {{ listing.unit }}s</span>
              <span class="font-extrabold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                <Lock class="w-3.5 h-3.5" /> Log In to Order
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-12 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-3 md:col-span-2">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Sprout class="w-5 h-5" />
            </div>
            <span class="font-heading font-extrabold text-xl text-emerald-900 dark:text-emerald-400">Alazar-Agri</span>
          </div>
          <p class="text-sm text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
            Integrated farm record-keeping and agricultural marketplace built specifically for Ethiopian poultry producers, feed mills, and commercial buyers.
          </p>
          <div class="text-xs text-stone-500 font-bold pt-1">
            Bishoftu • Addis Ababa • Adama • Hawassa • Bahir Dar
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">Access Portal</h4>
          <ul class="space-y-2 text-sm text-stone-600 dark:text-stone-400">
            <li><button @click="openLogin('farmer')" class="hover:underline font-bold text-left cursor-pointer">Farmer Sign In</button></li>
            <li><button @click="openLogin('buyer')" class="hover:underline font-bold text-left cursor-pointer">Buyer Sign In</button></li>
            <li><button @click="openLogin('farmer')" class="hover:underline font-bold text-left cursor-pointer">Create Account</button></li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="font-extrabold text-sm uppercase tracking-wider text-stone-900 dark:text-stone-100">Local Operations</h4>
          <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-semibold">
            Bishoftu Agro Hub, Oromia Region.<br />
            Email: contact@alazar-agri.et<br />
            Phone: +251 911 234 567
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-stone-200 dark:border-stone-800 text-center text-xs font-semibold text-stone-500">
        &copy; 2026 Alazar-Agri. High-Contrast Field Usability Platform.
      </div>
    </footer>

    <!-- Header Login Modal -->
    <LoginModal
      :show="isLoginModalOpen"
      :initial-role="modalRole"
      @close="isLoginModalOpen = false"
    />

    <!-- Toast Banner -->
    <BaseToast />
  </div>
</template>
