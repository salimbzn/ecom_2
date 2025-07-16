<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/stores/products'
import ProductGrid from '@/components/ProductGrid.vue'

const productStore = useProductStore()
const currentPage = ref(1)
const pageSize = 8

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(productStore.newCount / pageSize))
})

const fetchPage = () => {
  productStore.fetchNewProducts({
    page: currentPage.value,
    page_size: pageSize
  })
}

onMounted(fetchPage)
watch(currentPage, fetchPage)
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-semibold mb-6">New Arrivals</h2>

    <!-- Loading Spinner -->
    <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
      <svg class="animate-spin h-8 w-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <p class="text-lg font-medium">Loading New Arrivals…</p>
    </div>

    <!-- Error -->
    <div v-else-if="productStore.error" class="text-center text-red-500 py-10">
      {{ productStore.error }}
    </div>

    <!-- Product Grid -->
    <ProductGrid
      v-else
      :products="productStore.newProducts"
      :loading="productStore.loading"
      :error="productStore.error"
    />

    <!-- Empty State -->
    <div
      v-if="!productStore.loading && !productStore.error && productStore.newProducts.length === 0"
      class="text-center text-gray-500 mt-10"
    >
      No new arrivals found.
    </div>

    <!-- Pagination with Fade Transition -->
    <Transition name="fade">
      <div v-if="!productStore.loading && totalPages > 1" class="flex justify-center items-center gap-4 mt-10">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-orange-500 text-white rounded-xl shadow transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div class="text-sm sm:text-base px-4 py-2 text-gray-700 bg-white border rounded-lg shadow-sm">
          Page <span class="font-semibold">{{ currentPage }}</span> of <span class="font-semibold">{{ totalPages }}</span>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-orange-500 text-white rounded-xl shadow transition hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
