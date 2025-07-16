<template>
  <section class="max-w-screen-xl mx-auto px-4 py-6">
    <h2 v-if="title" class="text-xl font-bold text-gray-800 mb-4">{{ title }}</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <!-- Loading Skeletons -->
      <div v-if="loading" v-for="n in 8" :key="n" class="animate-pulse space-y-2">
        <div class="w-full h-40 bg-gray-200 rounded-lg"></div>
        <div class="h-3 w-3/4 bg-gray-100 rounded mx-auto"></div>
        <div class="h-3 w-1/2 bg-gray-100 rounded mx-auto"></div>
      </div>

      <!-- Product Results -->
      <RouterLink
        v-else
        v-for="(product, index) in products"
        :key="index"
        :to="{
          name: 'productDetail',
          params: { id: product.id }
        }"
        class="block"
      >
        <ProductCard :product="product" />
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  title: String,
  products: Array,
  loading: Boolean,
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
}
</style>
