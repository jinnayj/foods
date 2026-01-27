<template>
  <div class="font-sans text-gray-900">
    
    <header class="relative h-[500px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=80" 
          class="w-full h-full object-cover filter brightness-50"
        />
      </div>
      
      <div class="relative z-10 text-center text-white px-4">
        <span class="block text-sm md:text-base tracking-[0.2em] mb-4 text-gray-300 uppercase">New Collection 2026</span>
        <h2 class="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight drop-shadow-xl">
          Street <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Soul.</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-lg mx-auto font-light">
          ปลดปล่อยตัวตนผ่านรองเท้าสนีกเกอร์รุ่น Limited Edition ที่ออกแบบมาเพื่อคุณโดยเฉพาะ
        </p>
        <button 
          @click="$el.querySelector('main').scrollIntoView({ behavior: 'smooth' })"
          class="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition duration-300 shadow-lg"
        >
          ช้อปสินค้าใหม่
        </button>
      </div>
    </header>

    <div class="bg-black text-white py-16 border-b border-gray-800">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
          <div class="px-4 py-4 space-y-3">
            <h3 class="font-black text-xl tracking-widest uppercase">Free Shipping</h3>
            <p class="text-gray-500 text-sm font-light">ส่งฟรีทุกออเดอร์ ไม่มีขั้นต่ำ</p>
          </div>
          <div class="px-4 py-4 space-y-3">
            <h3 class="font-black text-xl tracking-widest uppercase">Original 100%</h3>
            <p class="text-gray-500 text-sm font-light">สินค้าลิขสิทธิ์แท้ มีใบรับประกัน</p>
          </div>
          <div class="px-4 py-4 space-y-3">
            <h3 class="font-black text-xl tracking-widest uppercase">7 Days Return</h3>
            <p class="text-gray-500 text-sm font-light">เปลี่ยน/คืนสินค้าได้ภายใน 7 วัน</p>
          </div>
        </div>
      </div>
    </div>

    <main class="container mx-auto px-4 py-16">
      
      <section id="category-section" class="mb-24">
        <div class="flex items-center justify-between mb-10">
           <h3 class="text-4xl font-black uppercase">Categories</h3>
           <p class="text-gray-400 text-sm hidden md:block">SELECT YOUR STYLE</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <nuxt-link to="/category/Men" class="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-5xl font-black uppercase tracking-tighter mb-2">Men</h2>
              <span class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">Shop Now →</span>
            </div>
          </nuxt-link>

          <nuxt-link to="/category/Women" class="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-5xl font-black uppercase tracking-tighter mb-2">Women</h2>
              <span class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">Shop Now →</span>
            </div>
          </nuxt-link>

          <nuxt-link to="/category/Running" class="relative h-[450px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-5xl font-black uppercase tracking-tighter mb-2">Sport</h2>
              <span class="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">Shop Now →</span>
            </div>
          </nuxt-link>
        </div>
      </section>

      <div class="flex items-end justify-between mb-10">
        <h3 class="text-3xl font-black uppercase">Trending Now 🔥</h3>
        <a href="#" class="hidden md:block text-sm font-bold border-b-2 border-black hover:text-gray-600 transition">View All</a>
      </div>

      <div v-if="$fetchState.pending" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-black"></div>
      </div>

      <div v-else-if="$fetchState.error" class="text-center py-20 text-red-500">
        โหลดข้อมูลไม่สำเร็จ (ลองรีเฟรชใหม่นะ)
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <nuxt-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group cursor-pointer block"
        >
          <div class="relative w-full overflow-hidden rounded-xl bg-gray-100 aspect-w-1 aspect-h-1 mb-4">
             <span class="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase tracking-wider">New</span>
            
            <img 
              :src="product.image_url" 
              class="h-72 w-full object-cover object-center group-hover:scale-110 transition duration-500 ease-in-out"
            />
          </div>
          
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-base font-bold text-gray-900 group-hover:text-gray-600 transition">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.category || 'Sneaker' }}</p>
            </div>
            <p class="text-base font-bold text-black">฿{{ product.price.toLocaleString() }}</p>
          </div>
        </nuxt-link>
      </div>
    </main>

    <section class="bg-yellow-400 py-16 px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h3 class="text-3xl font-black mb-4 uppercase">Don't Miss Out</h3>
        <p class="text-lg font-medium mb-8">สมัครสมาชิกรับส่วนลด 10% สำหรับออเดอร์แรก และข่าวสารสินค้าใหม่ก่อนใคร</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="email" placeholder="Enter your email" class="flex-1 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-black outline-none" />
          <button class="bg-black text-white px-8 py-4 rounded-full font-bold uppercase hover:bg-gray-800 transition">Subscribe</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  data() {
    return {
      products: []
    }
  },
  async fetch() {
    try {
      const { data, error } = await this.$supabase
        .from('products')
        .select('*')
        .order('id')
        .limit(4) // โชว์แค่ 4 ชิ้นพอหน้าแรกจะได้โหลดไว
      
      if (error) throw error
      this.products = data
    } catch (error) {
      console.error(error)
    }
  }
}
</script>