<template>
  <div class="font-sans text-gray-900">
    <header class="bg-gray-100 py-20 text-center px-4">
      <h2 class="text-6xl font-black mb-4 uppercase">Just Walk It.</h2>
      <p class="text-xl text-gray-600 mb-8">รองเท้าสไตล์สตรีท คอลเลกชันใหม่ล่าสุด</p>
      
      <button 
        @click="$el.querySelector('main').scrollIntoView({ behavior: 'smooth' })"
        class="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition transform hover:scale-105"
      >
        ช้อปเลย
      </button>
    </header>

    <main class="container mx-auto px-4 py-12">
      <h3 class="text-2xl font-bold mb-6">Trending Now</h3>

      <div v-if="$fetchState.pending" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p class="mt-2 text-gray-500">กำลังโหลดสินค้า...</p>
      </div>

      <div v-else-if="$fetchState.error" class="text-center py-20 text-red-500">
        เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <nuxt-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group cursor-pointer block"
        >
          <div class="w-full overflow-hidden rounded-lg bg-gray-200 aspect-w-1 aspect-h-1">
            <img 
              :src="product.image_url" 
              :alt="product.name"
              class="h-64 w-full object-cover object-center group-hover:opacity-75 group-hover:scale-105 transition duration-300"
            />
          </div>
          
          <div class="mt-4 flex justify-between items-start">
            <div>
              <h3 class="text-sm text-gray-700 font-bold">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.category || 'Sneaker' }}</p>
            </div>
            <p class="text-lg font-medium text-gray-900">฿{{ product.price.toLocaleString() }}</p>
          </div>
        </nuxt-link>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: []
    }
  },
  // asyncData หรือ fetch ทำงานเหมือนเดิม ไม่ต้องแก้ครับ
  async fetch() {
    try {
      const { data, error } = await this.$supabase
        .from('products')
        .select('*')
        .order('id')
      
      if (error) throw error
      
      this.products = data
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }
}
</script>