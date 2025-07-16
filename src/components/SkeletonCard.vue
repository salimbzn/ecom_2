<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
    <div v-for="n in count" :key="n" class="animate-pulse space-y-3">
      <div class="w-full h-44 bg-gray-300 rounded-lg"></div>
      <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 4,
  },
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>