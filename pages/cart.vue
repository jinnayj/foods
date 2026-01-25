<template>
  <div class="container mx-auto px-4 py-10">
    <h1 class="text-3xl font-black mb-8">SHOPPING BAG</h1>

    <div v-if="cartItems.length === 0" class="text-center py-20 bg-gray-50 rounded-lg">
      <p class="text-xl text-gray-500 mb-6">ไม่มีสินค้าในตะกร้า</p>
      <nuxt-link to="/" class="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
        ไปช้อปปิ้งกันเถอะ
      </nuxt-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      
      <div class="lg:col-span-2 space-y-6">
        <div v-for="(item, index) in cartItems" :key="index" class="flex gap-4 border-b pb-6">
          <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="item.image_url" class="w-full h-full object-cover" />
          </div>
          
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="font-bold text-lg">{{ item.name }}</h3>
              <p class="font-medium">฿{{ item.price.toLocaleString() }}</p>
            </div>
            <p class="text-gray-500 text-sm">Size: US {{ item.size }}</p>
            <p class="text-gray-500 text-sm">{{ item.category }}</p>
            
            <button 
              @click="removeItem(index)" 
              class="text-red-500 text-sm mt-2 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-6 rounded-xl h-fit">
        <h2 class="text-xl font-bold mb-4">Summary</h2>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-medium">฿{{ totalPrice.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between mb-4">
          <span class="text-gray-600">Shipping</span>
          <span class="text-green-600 font-medium">Free</span>
        </div>
        <div class="border-t pt-4 flex justify-between mb-6">
          <span class="text-xl font-bold">Total</span>
          <span class="text-xl font-bold">฿{{ totalPrice.toLocaleString() }}</span>
        </div>
        
        <nuxt-link to="/checkout" class="block w-full bg-black text-white text-center py-4 rounded-full font-bold hover:bg-gray-800 transition">
          Checkout
        </nuxt-link>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // ดึงข้อมูลจาก Vuex มาใช้ง่ายๆ
    cartItems() {
      return this.$store.state.cart.items
    },
    totalPrice() {
      return this.$store.getters['cart/totalPrice']
    }
  },
  methods: {
    removeItem(index) {
      this.$store.commit('cart/REMOVE_ITEM', index)
    }
  }
}
</script>