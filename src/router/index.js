import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/SearchResultView.vue'),
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path:'/products/:id',
      name : 'productDetail',
      component: () => import('../views/ProductDetailView.vue'),
    },
    {
      path:'/onSales',
      name: 'onSales',
      component: () => import('../views/OnSalesView.vue'),
    },
    {
      path:'/newArrivals',
      name: 'newArrivals',
      component: () => import('../views/NewArrivalsView.vue'),
    }
  ],
})

export default router
