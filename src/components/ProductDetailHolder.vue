<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Product Images Gallery -->
      <div>
        <Card class="w-full">
          <template #content>
            <Transition name="fade-slide" appear>
              <div v-if="mainImage" class="flex flex-col">
                <div class="bg-white rounded-xl shadow mb-6 flex items-center justify-center min-h-[500px]">
                  <img
                    :src="mainImage.image"
                    :alt="product.name"
                    loading="eager"
                    class="rounded-xl max-h-[600px] object-contain transition-all duration-300"
                    style="max-width: 100%;"
                  />
                </div>

                <div
                  v-if="!loadingExtras && product.images && product.images.length > 1"
                  class="flex gap-3 overflow-x-auto pb-2 bg-gray-50 rounded-lg px-3 py-2 shadow-inner"
                >
                  <img
                    v-for="img in product.images"
                    loading="eager"
                    :key="img.id"
                    :src="getOptimizedImage(img.image)"
                    :alt="product.name"
                    class="w-20 h-20 object-contain rounded-lg border cursor-pointer shrink-0 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    :class="{
                      'ring-2 ring-orange-500 border-orange-300': img.id === mainImage?.id,
                      'border-gray-200': img.id !== mainImage?.id
                    }"
                    @click="selectMainImage(img)"
                  />
                </div>

                <div v-else-if="loadingExtras" class="flex gap-3 mt-2">
                  <div v-for="n in 3" :key="n" class="w-20 h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
              </div>
            </Transition>
          </template>
        </Card>
      </div>

      <!-- Product Details -->
      <div>
        <Card class="w-full">
          <template #content>
            <Transition name="fade-slide" appear>
              <div class="space-y-6">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                  {{ product.name }}
                </h1>
                <p class="text-gray-600 text-sm md:text-base leading-relaxed">
                  {{ product.description }}
                </p>
                <Divider />
                <div class="flex items-center gap-3 flex-wrap">
                  <span v-if="product.discount_price" class="text-gray-400 line-through text-xl">
                    {{ product.price }} DA
                  </span>
                  <span class="text-2xl font-bold text-orange-500">
                    {{ product.discount_price || product.price }} DA
                  </span>
                  <Tag v-if="product.discount_price" severity="warn" value="Promo" />
                </div>
                <Divider />
                <div class="space-y-2">

                  <div v-if="!loadingExtras && product.variants && product.variants.length" class="flex flex-col gap-2">
                    <span class="text-gray-700 font-medium">Choose Size:</span>
                    <div class="flex gap-2 flex-wrap">
                      <Button
                        v-for="variant in product.variants"
                        :key="variant.id"
                        :label="variant.size"
                        :disabled="variant.stock === 0"
                        @click="selectVariant(variant)"
                        :class="selectedVariant?.id === variant.id ? 'p-button-warning' : 'p-button-outlined'"
                      />
                    </div>
                  </div>
                  <div v-else-if="loadingExtras" class="flex gap-2">
                    <div v-for="n in 3" :key="n" class="w-16 h-10 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>

                <Divider />

                <div class="flex flex-col sm:flex-row sm:gap-12 sm:items-center gap-4 pt-4">
                  <div class="flex items-center gap-2">
                    <label for="quantity" class="text-gray-700 font-medium">Quantity:</label>
                    <InputNumber
                      id="quantity"
                      v-model.number="rawQuantity"
                      :min="1"
                      showButtons
                      buttonLayout="horizontal"
                      decrementButtonClass="p-button-text"
                      incrementButtonClass="p-button-text"
                      :disabled="!selectedVariant || maxAddable <= 0"
                      class="w-28"
                      :inputStyle="{ width: '60px' }"
                    />
                  </div>

                  <Button
                    label="Add to Cart"
                    :disabled="!selectedVariant || selectedVariant.stock === 0 || maxAddable <= 0"
                    class="w-full sm:w-auto px-6 py-3 rounded-full text-lg font-medium p-button-warning"
                    @click="addToCart"
                  />
                  <Button
                    label="Buy Now"
                    v-if="selectedVariant && selectedVariant.stock > 0"
                    :disabled="!selectedVariant || maxAddable <= 0"
                    class="w-full sm:w-auto px-6 py-3 rounded-full text-lg font-medium p-button-success"
                    @click="buyNow"
                  />
                </div>
              </div>
            </Transition>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  product: { type: Object, required: true },
  loadingExtras: { type: Boolean, default: false }
})

const selectedVariant = ref(null)
const mainImage = ref(null)
const rawQuantity = ref(1)

const cartStore = useCartStore()
const router = useRouter()

function getOptimizedImage(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url
  const parts = url.split('/upload/')
  return `${parts[0]}/upload/f_auto,q_auto,w_800,h_600,c_fit/${parts[1]}`
}

// Always set mainImage from main_image immediately, then update if images arrive
watch(
  [() => props.product.main_image, () => props.product.images],
  ([mainImg, images]) => {
    if (images && images.length > 0) {
      mainImage.value = {
        ...images.find(img => img.is_main) || images[0],
        image: getOptimizedImage((images.find(img => img.is_main) || images[0]).image)
      }
    } else if (mainImg) {
      mainImage.value = { image: getOptimizedImage(mainImg) }
    } else {
      mainImage.value = null
    }
    selectedVariant.value = null
    rawQuantity.value = 1
  },
  { immediate: true }
)

function selectMainImage(img) {
  mainImage.value = { ...img, image: getOptimizedImage(img.image) }
}
function selectVariant(variant) {
  selectedVariant.value = variant
  rawQuantity.value = 1
}

const maxAddable = computed(() =>
  selectedVariant.value
    ? selectedVariant.value.stock - (cartStore.items.find(i => i.variantId === selectedVariant.value.id)?.quantity || 0)
    : 0
)

function addToCart() {
  if (!selectedVariant.value) {
    toast.warning('Please select a size.')
    return
  }

  const qty = rawQuantity.value
  if (qty < 1 || qty > selectedVariant.value.stock || qty > maxAddable.value) {
    toast.error(`Invalid quantity.`)
    return
  }

  const item = {
    productId: props.product.id,
    variantId: selectedVariant.value.id,
    size: selectedVariant.value.size,
    stock: selectedVariant.value.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: mainImage.value?.image || '',
    quantity: qty,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} (Size: ${item.size}) x${qty} added to cart`)
  router.push({ name: 'products' })
}

function buyNow() {
  if (!selectedVariant.value || rawQuantity.value > maxAddable.value) {
    toast.warning('Invalid quantity or size.')
    return
  }

  const item = {
    productId: props.product.id,
    variantId: selectedVariant.value.id,
    size: selectedVariant.value.size,
    stock: selectedVariant.value.stock,
    name: props.product.name,
    price: props.product.discount_price || props.product.price,
    image: mainImage.value?.image || '',
    quantity: rawQuantity.value,
  }

  cartStore.addItem(item)
  toast.success(`${props.product.name} (Size: ${item.size}) x${rawQuantity.value} added to cart`)
  router.push({ name: 'cart' })
}
</script>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
