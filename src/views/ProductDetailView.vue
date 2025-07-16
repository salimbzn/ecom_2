<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ProductDetailHolder from '@/components/ProductDetailHolder.vue'

const route = useRoute()
const productId = route.params.id

const product = ref(null)
const loading = ref(true)
const error = ref('')
const loadingExtras = ref(true)

async function fetchProductDetails() {
  try {
    const res = await axios.get(`https://ecom-shoe-no8p.onrender.com/api/products/${productId}/`)
    product.value = res.data
  } catch (e) {
    console.error('Error fetching product:', e)
    error.value = 'Failed to load product details.'
  } finally {
    loading.value = false
  }
}

async function fetchProductVariants() {
  try {
    const res = await axios.get(`https://ecom-shoe-no8p.onrender.com/api/products/${productId}/variants/`)
    if (product.value) {
      product.value.variants = res.data.variants
    }
  } catch (e) {
    console.warn('Variants fetch failed:', e)
  } finally {
    loadingExtras.value = false
  }
}

onMounted(async () => {
  await fetchProductDetails()
  if (product.value) {
    fetchProductVariants() // fire in background
  }
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div v-if="loading" class="flex flex-col lg:flex-row gap-10 animate-pulse">
      <!-- Image Placeholder -->
      <div class="flex-1">
        <div class="w-full h-[500px] bg-gray-200 rounded-xl shadow-inner"></div>
      </div>

      <!-- Details Placeholder -->
      <div class="flex-1 space-y-4">
        <div class="h-10 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        <div class="h-4 bg-gray-200 rounded w-4/6"></div>
        <div class="h-8 bg-gray-300 rounded w-40 mt-4"></div>
        <div class="h-4 bg-gray-200 rounded w-32"></div>
        <div>
          <div class="h-5 bg-gray-200 rounded w-20 mb-2"></div>
          <div class="flex gap-2">
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
            <div class="w-16 h-10 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div class="pt-4 flex items-center gap-4 flex-wrap">
          <div class="w-28 h-10 bg-gray-300 rounded-md"></div>
          <div class="w-36 h-12 bg-orange-300 rounded-full"></div>
        </div>
      </div>
    </div>

    <ProductDetailHolder
      v-else-if="product"
      :product="product"
      :loading-extras="loadingExtras"
    />

    <div v-else class="text-center text-red-600 font-semibold pt-6">
      {{ error || 'Product not found.' }}
    </div>
  </div>
</template>
