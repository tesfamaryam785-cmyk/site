import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: { standalone: true }
    },
    {
      path: '/showcase',
      name: 'showcase',
      component: () => import('@/pages/DemoPage.vue'),
      meta: { standalone: true }
    },
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { standalone: true },
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/pages/auth/Login.vue')
        }
      ]
    },
    {
      path: '/register',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { standalone: true },
      children: [
        {
          path: '',
          name: 'register',
          component: () => import('@/pages/auth/Register.vue')
        }
      ]
    },
    {
      path: '/auth/farm-setup',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { standalone: true },
      children: [
        {
          path: '',
          name: 'farm-setup',
          component: () => import('@/pages/auth/FarmSetup.vue')
        }
      ]
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/pages/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/farm',
      component: () => import('@/pages/farm/FarmIndexPage.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/farm/flocks'
        },
        {
          path: 'flocks',
          name: 'farm-flocks',
          component: () => import('@/pages/farm/Flocks.vue')
        },
        {
          path: 'production',
          name: 'farm-production',
          component: () => import('@/pages/farm/Production.vue')
        },
        {
          path: 'feed',
          name: 'farm-feed',
          component: () => import('@/pages/farm/Feed.vue')
        },
        {
          path: 'mortality',
          name: 'farm-mortality',
          component: () => import('@/pages/farm/Mortality.vue')
        },
        {
          path: 'health',
          name: 'farm-health',
          component: () => import('@/pages/farm/Health.vue')
        },
        {
          path: 'transactions',
          name: 'farm-transactions',
          component: () => import('@/pages/farm/Transactions.vue')
        }
      ]
    },
    {
      path: '/marketplace',
      component: () => import('@/pages/marketplace/MarketplaceIndexPage.vue'),
      children: [
        {
          path: '',
          redirect: '/marketplace/browse'
        },
        {
          path: 'browse',
          name: 'marketplace-browse',
          component: () => import('@/pages/marketplace/Browse.vue')
        },
        {
          path: 'create',
          name: 'marketplace-create',
          component: () => import('@/pages/marketplace/CreateListing.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'my-listings',
          name: 'marketplace-my-listings',
          component: () => import('@/pages/marketplace/MyListings.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: ':id',
          name: 'marketplace-detail',
          component: () => import('@/pages/marketplace/ListingDetail.vue')
        },
        {
          path: 'seller/:id',
          name: 'marketplace-seller',
          component: () => import('@/pages/marketplace/SellerProfile.vue')
        }
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsPage.vue')
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
