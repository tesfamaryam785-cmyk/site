<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import { Tractor, HeartPulse, ShieldAlert } from 'lucide-vue-next'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-extrabold font-heading text-stone-900 dark:text-stone-100">
        Farm Management
      </h1>
      <p class="text-stone-600 dark:text-stone-400 mt-1">
        Manage livestock records, crop field rotation, and equipment maintenance schedules.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold font-heading flex items-center gap-2">
              <HeartPulse class="w-5 h-5 text-primary-600" />
              Livestock Herd Health
            </h2>
            <BaseBadge variant="active">142 Healthy</BaseBadge>
          </div>
        </template>
        <p class="text-stone-700 dark:text-stone-300">
          Veterinary logs, vaccination alerts, and weight progression charts will be loaded here.
        </p>
      </BaseCard>

      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold font-heading flex items-center gap-2">
              <Tractor class="w-5 h-5 text-accent-500" />
              Equipment & Fleet
            </h2>
            <BaseBadge variant="warning">1 Maintenance Due</BaseBadge>
          </div>
        </template>
        <p class="text-stone-700 dark:text-stone-300">
          Tractor fuel metrics, field hours, and preventive maintenance logs.
        </p>
      </BaseCard>
    </div>
  </div>
</template>
