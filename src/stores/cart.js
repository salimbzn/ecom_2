// src/stores/cart.js
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems') || '[]')
  }),
  getters: {
    totalPrice(state) {
      return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    }
  },
  actions: {
    persist() {
      localStorage.setItem('cartItems', JSON.stringify(this.items))
    },
    addItem(product) {
      const existing = this.items.find(i => i.productId === product.productId)
      if (existing) {
        existing.quantity += product.quantity
      } else {
        this.items.push({ ...product })
      }
      this.persist()
    },
    updateQuantity(productId, newQty) {
      const item = this.items.find(i => i.productId === productId)
      if (item && newQty > 0) {
        item.quantity = newQty
        this.persist()
      }
    },
    removeItem(productId) {
      this.items = this.items.filter(i => i.productId !== productId)
      this.persist()
    },
    clearCart() {
      this.items = []
      this.persist()
    }
  }
})
