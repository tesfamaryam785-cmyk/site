<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppShell from '@/layouts/AppShell.vue'

const route = useRoute()
</script>

<template>
  <div v-if="route.meta.standalone" class="min-h-screen bg-bg-light dark:bg-bg-dark text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200">
    <RouterView />
  </div>
  <AppShell v-else>
    <RouterView />
  </AppShell>
</template>
