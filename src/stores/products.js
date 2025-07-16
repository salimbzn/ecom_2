import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = 'https://ecom-shoe-no8p.onrender.com/api/products'

export const useProductStore = defineStore('product', {
  state: () => ({
    discounted: [],
    newProducts: [],
    topOrdered: [],
    products: [],
    loadingProducts: false,
    loadingTopOrdered: false,
    loadingDiscounted: false,
    loadingNewProducts: false,
    error: null,
    // Add other state as needed
  }),

  actions: {
    // Home page: Top 4 discounted
    async fetchDiscountedHome() {
      this.loadingDiscounted = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/discounted-home/`)
        const data = res.data
        this.discounted = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
      } catch {
        this.error = 'Failed to load discounted products.'
      } finally {
        this.loadingDiscounted = false
      }
    },

    // Home page: Top 4 new
    async fetchNewProductsHome() {
      this.loadingNewProducts = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/new-home/`)
        const data = res.data
        this.newProducts = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url,
          isNew: true
        }))
      } catch {
        this.error = 'Failed to load new products.'
      } finally {
        this.loadingNewProducts = false
      }
    },

    // Home page: Top 4 top-ordered
    async fetchTopOrderedHome() {
      this.loadingTopOrdered = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/top-ordered-home/`)
        const data = res.data
        this.topOrdered = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
      } catch {
        this.error = 'Failed to load top ordered products.'
      } finally {
        this.loadingTopOrdered = false
      }
    },

    // Original: Fetch all products (with pagination/filter)
    async fetchProducts(params = {}) {
      this.loadingProducts = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/list/`, { params })
        const data = res.data
        this.products = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
        // Optionally handle pagination info here
      } catch {
        this.error = 'Failed to load products.'
      } finally {
        this.loadingProducts = false
      }
    },

    // Original: Fetch all discounted products (with pagination/filter)
    async fetchDiscounted(params = {}) {
      this.loadingDiscounted = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/discounted/`, { params })
        const data = res.data
        this.discounted = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
      } catch {
        this.error = 'Failed to load discounted products.'
      } finally {
        this.loadingDiscounted = false
      }
    },

    // Original: Fetch all new products (with pagination/filter)
    async fetchNewProducts(params = {}) {
      this.loadingNewProducts = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/new/`, { params })
        const data = res.data
        this.newProducts = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url,
          isNew: true
        }))
      } catch {
        this.error = 'Failed to load new products.'
      } finally {
        this.loadingNewProducts = false
      }
    },

    // Original: Fetch all top-ordered products (with pagination/filter)
    async fetchTopOrdered(params = {}) {
      this.loadingTopOrdered = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/top-ordered/`, { params })
        const data = res.data
        this.topOrdered = (data.results || data).map(p => ({
          ...p,
          image: p.main_image_url
        }))
      } catch {
        this.error = 'Failed to load top ordered products.'
      } finally {
        this.loadingTopOrdered = false
      }
    },
  },
})