<template>
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <p class="text-gray-500 text-sm uppercase tracking-widest mb-2">Collection</p>
      <h1 class="text-5xl font-black uppercase">{{ categoryName }}</h1>
    </div>

    <div v-if="$fetchState.pending" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black"></div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 bg-gray-50 rounded-lg">
      <p class="text-xl text-gray-500">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
      <nuxt-link to="/" class="mt-4 inline-block text-black underline hover:text-gray-600">กลับหน้าแรก</nuxt-link>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <nuxt-link 
        v-for="product in products" 
        :key="product.id" 
        :to="`/product/${product.id}`"
        class="group cursor-pointer block"
      >
        <div class="relative w-full overflow-hidden rounded-xl bg-gray-100 aspect-w-1 aspect-h-1 mb-4">
          <img 
            :src="product.image_url" 
            class="h-72 w-full object-cover object-center group-hover:scale-110 transition duration-500 ease-in-out"
          />
        </div>
        
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-base font-bold text-gray-900 group-hover:text-gray-600 transition">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">{{ product.category }}</p>
          </div>
          <p class="text-base font-bold text-black">฿{{ product.price.toLocaleString() }}</p>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      categoryName: ''
    }
  },
 async fetch() {
  this.categoryName = this.$route.params.slug

  try {
    let query = this.$supabase
      .from('products')
      .select('*')

    // 🟢 ถ้าเป็นหน้า NEW → เอาสินค้าล่าสุด
    if (this.categoryName.toLowerCase() === 'new') {
      query = query.order('created_at', { ascending: false })
    } 
    // 🟢 ถ้าเป็นหมวดปกติ → filter category
    else {
      query = query
        .ilike('category', this.categoryName)
        .order('id')
    }

    const { data, error } = await query
    if (error) throw error

    this.products = data
  } catch (error) {
    console.error(error)
  }
}
}
</script>