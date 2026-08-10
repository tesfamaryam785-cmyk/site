<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFarmStore } from '@/stores/farmStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle2, History, CreditCard } from 'lucide-vue-next'

const farmStore = useFarmStore()
const toast = useToast()

const txType = ref<'income' | 'expense' | 'sale'>('sale')
const category = ref('egg sales')
const amountVal = ref(225.00)
const descriptionStr = ref('Wholesale sale: 50 egg trays @ 4.50 Birr')
const recordDate = ref(new Date().toISOString().split('T')[0])
const isSubmitting = ref(false)

const expenseCategories = [
  { label: 'Feed Purchase', value: 'feed' },
  { label: 'Medication & Vaccines', value: 'medication' },
  { label: 'Farm Labor & Wages', value: 'labor' },
  { label: 'Equipment & Maintenance', value: 'equipment' },
  { label: 'Utilities & Other', value: 'other' }
]

const incomeCategories = [
  { label: 'Egg Sales (Wholesale / Retail)', value: 'egg_sales' },
  { label: 'Live Bird / Broiler Sales', value: 'bird_sales' },
  { label: 'Compost & By-product Sales', value: 'byproduct_sales' },
  { label: 'Other Income', value: 'other' }
]

const categoryOptions = computed(() => {
  return txType.value === 'expense' ? expenseCategories : incomeCategories
})

function setTxType(type: 'income' | 'expense' | 'sale') {
  txType.value = type
  category.value = type === 'expense' ? 'feed' : 'egg_sales'
}

// Running monthly financial figures
const monthlyTotalIncome = computed(() => {
  return farmStore.transactions
    .filter(t => t.type === 'income' || t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyTotalExpense = computed(() => {
  return farmStore.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyNetProfit = computed(() => {
  return monthlyTotalIncome.value - monthlyTotalExpense.value
})

onMounted(() => {
  farmStore.fetchFarmData()
})

async function submitTransaction() {
  if (amountVal.value <= 0) {
    toast.error('Invalid Amount', 'Please enter an amount greater than 0.')
    return
  }

  isSubmitting.value = true
  try {
    await farmStore.addTransaction({
      farmId: farmStore.farm?.id || 'farm-1',
      type: txType.value,
      category: category.value,
      amount: amountVal.value,
      description: descriptionStr.value,
      recordedAt: recordDate.value
    })
    toast.success(
      'Transaction Recorded',
      `Logged ${amountVal.value.toFixed(2)} Birr (${txType.value}).`
    )
  } catch (e) {
    toast.error('Error', 'Failed to log transaction.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-8 md:space-y-10">
    <div>
      <h1 class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2">
        <DollarSign class="w-6 h-6 text-primary-600 dark:text-primary-400" />
        Financial Ledger & Cash Flow
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-sm">
        Track farm income, batch egg sales, feed purchases, and net profitability in Birr.
      </p>
    </div>

    <!-- Monthly Summary Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <BaseCard>
        <span class="text-xs font-bold uppercase tracking-wider text-stone-500">Total Income (This Month)</span>
        <div class="flex items-center justify-between mt-1">
          <span class="text-2xl font-extrabold font-heading text-primary-600 dark:text-primary-400">
            +{{ monthlyTotalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} Birr
          </span>
          <ArrowUpRight class="w-6 h-6 text-primary-500" />
        </div>
      </BaseCard>

      <BaseCard>
        <span class="text-xs font-bold uppercase tracking-wider text-stone-500">Total Expenses (This Month)</span>
        <div class="flex items-center justify-between mt-1">
          <span class="text-2xl font-extrabold font-heading text-danger-500">
            -{{ monthlyTotalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} Birr
          </span>
          <ArrowDownRight class="w-6 h-6 text-danger-500" />
        </div>
      </BaseCard>

      <BaseCard highlighted highlight-variant="primary">
        <span class="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">Net Profit (This Month)</span>
        <div class="flex items-center justify-between mt-1">
          <span class="text-2xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
            {{ monthlyNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} Birr
          </span>
          <CreditCard class="w-6 h-6 text-primary-500" />
        </div>
      </BaseCard>
    </div>

    <!-- Entry Form Card -->
    <BaseCard>
      <template #header>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 class="text-lg font-bold font-heading text-stone-900 dark:text-stone-100">
            Record New Financial Transaction
          </h2>

          <!-- Type Segmented Control -->
          <div class="inline-flex rounded-xl bg-stone-200 dark:bg-stone-800 p-1">
            <button
              type="button"
              @click="setTxType('sale')"
              class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              :class="txType === 'sale' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              Batch Sale
            </button>
            <button
              type="button"
              @click="setTxType('income')"
              class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              :class="txType === 'income' ? 'bg-primary-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              Income
            </button>
            <button
              type="button"
              @click="setTxType('expense')"
              class="px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              :class="txType === 'expense' ? 'bg-danger-500 text-white shadow-xs' : 'text-stone-700 dark:text-stone-300'"
            >
              Expense
            </button>
          </div>
        </div>
      </template>

      <form @submit.prevent="submitTransaction" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseSelect
            v-model="category"
            label="Transaction Category"
            :options="categoryOptions"
            required
          />

          <BaseInput
            v-model.number="amountVal"
            type="number"
            step="0.01"
            label="Amount (Birr)"
            required
          />

          <BaseInput
            v-model="recordDate"
            type="date"
            label="Transaction Date"
            required
          />
        </div>

        <BaseInput
          v-model="descriptionStr"
          label="Description / Memo"
          placeholder="e.g. Wholesale sale: 50 egg trays @ 4.50 Birr"
          required
        />

        <div class="pt-3 flex justify-end">
          <BaseButton
            :variant="txType === 'expense' ? 'danger' : 'primary'"
            type="submit"
            size="lg"
            :loading="isSubmitting"
          >
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Save Transaction
          </BaseButton>
        </div>
      </form>
    </BaseCard>

    <!-- Ledger Table Card -->
    <BaseCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold font-heading flex items-center gap-2">
            <History class="w-5 h-5 text-stone-500" />
            Running Financial Ledger
          </h2>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            {{ farmStore.transactions.length }} Transactions
          </span>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 text-sm font-semibold">
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4">Type</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Description</th>
              <th class="py-3 px-4 text-right">Amount (Birr)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-stone-800/60 text-stone-800 dark:text-stone-200 text-base">
            <tr v-for="tx in farmStore.transactions" :key="tx.id" class="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
              <td class="py-3 px-4 font-mono font-medium text-sm">{{ tx.recordedAt }}</td>
              <td class="py-3 px-4">
                <BaseBadge :variant="tx.type === 'expense' ? 'danger' : 'active'">
                  {{ tx.type }}
                </BaseBadge>
              </td>
              <td class="py-3 px-4 font-medium capitalize text-sm text-stone-700 dark:text-stone-300">
                {{ tx.category.replace('_', ' ') }}
              </td>
              <td class="py-3 px-4 text-sm text-stone-900 dark:text-stone-100">
                {{ tx.description }}
              </td>
              <td
                class="py-3 px-4 font-extrabold text-right font-heading"
                :class="tx.type === 'expense' ? 'text-danger-500' : 'text-primary-600 dark:text-primary-400'"
              >
                {{ tx.type === 'expense' ? '-' : '+' }}{{ tx.amount.toFixed(2) }} Birr
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>
