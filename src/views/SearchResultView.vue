
<script setup>
import { debounce } from 'lodash'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGrid from '@/components/ProductGrid.vue'
import { useSearchStore } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const currentPage = ref(1)
const pageSize = 12
const pageTransitioning = ref(false)

const categoryId = ref(route.query.category ? Number(route.query.category) : null)

const categories = computed(() => [
  { id: 0, name: 'All', image: null },
  ...searchStore.categories
])

const currentCategoryName = computed(() => {
  if (!categoryId.value || categoryId.value === 0) return ''
  const cat = searchStore.categories.find(c => c.id === categoryId.value)
  return cat ? cat.name : ''
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil((searchStore.count || 0) / pageSize))
})

function buildQuery(cat, searchTerm, page = 1) {
  const q = searchTerm.trim();
  return {
    category: cat.id || undefined,
    search: q || undefined,
    page,
  };
}

function goToCategory(cat) {
  const query = buildQuery(cat, searchStore.searchTerm);
  router.push({ name: 'products', query });
}

const fetchPage = async () => {
  try {
    pageTransitioning.value = true
    searchStore.results = [] // ✅ Clear old results to prevent flicker
    window.scrollTo({ top: 0, behavior: 'smooth' }) // ✅ Bonus scroll to top
    await searchStore.searchProducts({
      page: currentPage.value,
      page_size: pageSize,
    })
  } catch (error) {
    console.error('Error fetching page:', error)
  } finally {
    pageTransitioning.value = false
  }
}

watch(
  () => route.query,
  debounce(async q => {
    searchStore.setSearchTerm(q.search || '')
    searchStore.setCategory(q.category ? Number(q.category) : null)
    categoryId.value = q.category ? Number(q.category) : null
    const page = Number(q.page || 1)
    if (page !== currentPage.value) currentPage.value = page
    searchStore.setPage(page)
    await fetchPage()
  }, 300),
  { immediate: true }
)

watch(currentPage, async val => {
  if (val === searchStore.page) return
  searchStore.setPage(val)
  const query = { ...route.query, page: val }
  router.replace({ name: route.name, query })
  await fetchPage()
})

watch(() => searchStore.page, (val) => {
  if (val !== currentPage.value) currentPage.value = val
})

onMounted(async () => {
  try {
    if (!searchStore.categories.length) await searchStore.fetchCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})
</script>

<template>
  <div>
    <div class="px-6 py-8 space-y-8">
      <!-- Category Carousel -->
      <div class="mb-6">
        <div class="flex gap-4 overflow-x-auto no-scrollbar pb-1">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="min-w-[120px] flex-shrink-0"
          >
            <div
              class="relative w-full h-24 rounded-lg overflow-hidden cursor-pointer group border-2 transition"
              v-bind:class="{
                'border-orange-500 shadow-md': cat.id === categoryId,
                'border-transparent': cat.id !== categoryId
              }"
              @click="goToCategory(cat)"
            >
              <div v-if="cat.id === 0" class="w-full h-full relative bg-gray-400 text-orange-700 font-semibold text-sm flex items-center justify-center">
                <svg class="w-9 h-9 text-white opacity-90" fill="none" viewBox="0 0 28 28" stroke="currentColor" stroke-width="1.5">
                  <rect x="4" y="4" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="4" y="14" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="14" y="4" width="6" height="6" rx="2" fill="currentColor" />
                  <rect x="14" y="14" width="6" height="6" rx="2" fill="currentColor" />
                </svg>
                <div class="absolute inset-0 flex items-end justify-center pb-2">
                  <span class="text-white font-semibold text-base drop-shadow">All</span>
                </div>
              </div>
              <img
                v-else-if="cat.image"
                :src="cat.image"
                :alt="cat.name"
                class="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div
                v-else
                class="w-full h-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold text-sm"
              >
                {{ cat.name }}
              </div>
              <div
                v-if="cat.id !== 0"
                class="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm"
              >
                {{ cat.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Results -->
      <ProductGrid
        :title="[
          'Results',
          currentCategoryName ? 'in ' + currentCategoryName : '',
          searchStore.searchTerm ? `for '${searchStore.searchTerm}'` : ''
        ].filter(Boolean).join(' ')"
        :products="searchStore.results"
        :loading="pageTransitioning || searchStore.loading"
        :error="searchStore.error"
      />

      <!-- No Results -->
      <div
        v-if="!searchStore.loading && !searchStore.error && searchStore.results.length === 0"
        class="text-center text-gray-500 mt-10"
      >
        No products found.
      </div>

      <!-- Pagination -->
      <Transition name="fade">
        <div v-if="!searchStore.loading && totalPages > 1" class="flex justify-center items-center gap-4 mt-10">
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
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>