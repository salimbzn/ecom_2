import { defineStore } from 'pinia'
import axios from 'axios'

export const useSearchStore = defineStore('search', {
  state: () => ({
    categories: [],
    selectedCategory: null,
    searchTerm: '',
    results: [],
    count: 0,
    next: null,
    previous: null,
    page: 1,
    loading: false,
    error: null,
    categoriesLoaded: false,
  }),

  actions: {
    async fetchCategories() {
      if (this.categoriesLoaded || this.loading) return
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('https://ecom-shoe-no8p.onrender.com/api/products/category/list')
        this.categories = response.data
        this.categoriesLoaded = true
      } catch {
        this.error = 'Failed to fetch categories.'
      } finally {
        this.loading = false
      }
    },

    setCategory(categoryId) {
      if (this.selectedCategory !== categoryId) {
        this.selectedCategory = categoryId
      }
    },

    setSearchTerm(term) {
      if (this.searchTerm !== term) {
        this.searchTerm = term
      }
    },

    setPage(page) {
      if (this.page !== page) {
        this.page = page
      }
    },

    async searchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        const query = {
          category: this.selectedCategory || undefined,
          search: this.searchTerm || undefined,
          page: this.page,
          page_size: 12,
          ...params
        }

        const response = await axios.get('https://ecom-shoe-no8p.onrender.com/api/products/list', {
          params: query,
        })

        const data = response.data

        this.results = (data.results || data || []).map(product => ({
          ...product,
          image: product.main_image_url
        }))

        this.count = data.count || this.results.length
        this.next = data.next ?? null
        this.previous = data.previous ?? null
      } catch {
        this.error = 'Failed to fetch products.'
      } finally {
        this.loading = false
      }
    },
  },
})