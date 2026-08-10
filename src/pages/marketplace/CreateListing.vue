<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketplaceStore } from '@/stores/marketplaceStore'
import { useToast } from '@/composables/useToast'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseNumberInput from '@/components/ui/BaseNumberInput.vue'
import { PlusCircle, Upload, CheckCircle2 } from 'lucide-vue-next'

const store = useMarketplaceStore()
const router = useRouter()
const toast = useToast()

const category = ref('Poultry & Chicks')
const title = ref('')
const description = ref('')
const price = ref(5.00)
const unit = ref('bag')
const quantityAvailable = ref(50)
const location = ref('Bishoftu (Debre Zeit), Oromia')
const imagePreview = ref('https://picsum.photos/seed/newitem/400/300')
const isSubmitting = ref(false)

const categoryOptions = [
  { label: 'Poultry & Chicks', value: 'Poultry & Chicks' },
  { label: 'Eggs (Table & Hatching)', value: 'Eggs' },
  { label: 'Feed & Nutrition', value: 'Feed' },
  { label: 'Equipment & Hardware', value: 'Equipment' },
  { label: 'Dairy Cattle (Coming Soon)', value: 'Dairy' },
  { label: 'Livestock (Coming Soon)', value: 'Livestock' },
  { label: 'Crops & Inputs (Coming Soon)', value: 'Crops' }
]

function onFileSelect(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  }
}

async function submitCreateListing() {
  if (!title.value || !description.value) {
    toast.error('Validation Error', 'Please fill in product title and description.')
    return
  }

  isSubmitting.value = true
  try {
    await store.addListing({
      sellerId: 'user-farmer-1',
      sellerName: 'Green Valley Farm',
      sellerRole: 'farmer',
      category: category.value,
      title: title.value,
      description: description.value,
      price: price.value,
      unit: unit.value,
      quantityAvailable: quantityAvailable.value,
      images: [imagePreview.value],
      location: location.value,
      status: 'active'
    })

    toast.success('Listing Created!', `Successfully published "${title.value}" on Marketplace.`)
    router.push('/marketplace/my-listings')
  } catch (e) {
    toast.error('Error', 'Failed to publish listing.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div>
      <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
        <PlusCircle class="w-7 h-7 text-primary-600 dark:text-primary-400" />
        List a Product for Sale (Seller Portal)
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-0.5 text-base">
        Create a new marketplace offer for buyers across the agricultural network.
      </p>
    </div>

    <BaseCard highlighted highlight-variant="primary">
      <form @submit.prevent="submitCreateListing" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSelect
            v-model="category"
            label="Product Category"
            :options="categoryOptions"
            required
          />

          <BaseInput
            v-model="title"
            label="Product Title"
            placeholder="e.g. Organic Layers (18 Weeks), 50kg Layer Mash"
            required
          />
        </div>

        <div class="w-full">
          <label class="text-base font-semibold text-stone-900 dark:text-stone-100 block mb-1.5">
            Full Product Description *
          </label>
          <textarea
            v-model="description"
            rows="4"
            placeholder="Provide specifications, vaccination status, delivery details..."
            class="w-full px-4 py-3 min-h-[100px] text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-accent-500"
            required
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseInput
            v-model.number="price"
            type="number"
            step="0.01"
            label="Unit Price (Birr)"
            required
          />

          <BaseInput
            v-model="unit"
            label="Unit Measurement"
            placeholder="e.g. tray, bag, bird, chick, kg"
            required
          />

          <BaseNumberInput
            v-model="quantityAvailable"
            label="Quantity Available"
            :min="1"
            :step="5"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput
            v-model="location"
            label="Pickup / Storage Location"
            placeholder="e.g. Rift Valley Farm Store"
            required
          />

          <div class="flex flex-col gap-1.5">
            <label class="text-base font-semibold text-stone-900 dark:text-stone-100">
              Product Photo Upload
            </label>
            <input
              type="file"
              accept="image/*"
              @change="onFileSelect"
              class="block w-full text-sm text-stone-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
            />
          </div>
        </div>

        <!-- Image Preview Block -->
        <div v-if="imagePreview" class="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center gap-4">
          <img :src="imagePreview" alt="Preview" class="w-24 h-20 object-cover rounded-lg border" />
          <div>
            <span class="text-sm font-bold text-stone-800 dark:text-stone-200">Image Preview Ready</span>
            <p class="text-xs text-stone-500">Will be featured on the product detail and browse grid.</p>
          </div>
        </div>

        <div class="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
          <BaseButton variant="ghost" type="button" @click="router.back()">
            Cancel
          </BaseButton>
          <BaseButton variant="primary" type="submit" size="lg" :loading="isSubmitting">
            <CheckCircle2 class="w-5 h-5 mr-2" />
            Publish Listing
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>
