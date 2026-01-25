<template>
  <div class="font-sans text-gray-900">
    <nav class="border-b bg-white sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <div class="flex items-center gap-8">
          <nuxt-link to="/" class="text-2xl font-bold italic tracking-tighter uppercase">
            CATWALK
          </nuxt-link>
          
          <div class="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
            <a href="#" class="hover:text-black transition">New Arrivals</a>
            <a href="#" class="hover:text-black transition">Men</a>
            <a href="#" class="hover:text-black transition">Women</a>
          </div>
        </div>

        <nuxt-link to="/cart" class="relative hover:text-gray-500 flex items-center group">
          <span class="text-2xl group-hover:scale-110 transition">🛒</span>
          
          <span 
            v-if="$store.getters['cart/totalItems'] > 0" 
            class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
          >
            {{ $store.getters['cart/totalItems'] }}
          </span>
        </nuxt-link>

      </div>
    </nav>

    <Nuxt />
  </div>
</template>

<script>
export default {
}
</script>