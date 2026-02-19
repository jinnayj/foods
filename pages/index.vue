<template>
  <div class="font-sans text-gray-900 bg-gray-50">
    
    <header class="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80" 
          class="w-full h-full object-cover filter brightness-50"
          alt="Delicious Food Header"
        />
      </div>
      
      <div class="relative z-10 text-center text-white px-4">
        <span class="block text-sm md:text-base tracking-[0.2em] mb-4 text-yellow-400 uppercase font-bold">อร่อย สดใหม่ ส่งตรงถึงบ้าน</span>
        <h2 class="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tight drop-shadow-xl">
          Premium <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Kitchen.</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-200 mb-8 max-w-lg mx-auto font-light">
          สัมผัสรสชาติอาหารไทยต้นตำรับ จากวัตถุดิบชั้นเลิศที่คัดสรรมาเพื่อคุณโดยเฉพาะ
        </p>
        <button 
          @click="$el.querySelector('#menu-section').scrollIntoView({ behavior: 'smooth' })"
          class="bg-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition duration-300 shadow-lg"
        >
          ดูเมนูอาหารทั้งหมด
        </button>
      </div>
    </header>

    <div class="bg-white text-black py-16 border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div class="px-4 py-4 space-y-3">
            <div class="text-4xl">🚚</div>
            <h3 class="font-black text-xl tracking-widest uppercase">Fast Delivery</h3>
            <p class="text-gray-500 text-sm font-light">ส่งด่วนภายใน 30 นาที อาหารยังร้อนแน่นอน</p>
          </div>
          <div class="px-4 py-4 space-y-3">
            <div class="text-4xl">🌿</div>
            <h3 class="font-black text-xl tracking-widest uppercase">Fresh Ingredients</h3>
            <p class="text-gray-500 text-sm font-light">ใช้วัตถุดิบสดใหม่ ส่งตรงจากฟาร์มทุกวัน</p>
          </div>
          <div class="px-4 py-4 space-y-3">
            <div class="text-4xl">⭐</div>
            <h3 class="font-black text-xl tracking-widest uppercase">Premium Quality</h3>
            <p class="text-gray-500 text-sm font-light">ปรุงโดยเชฟผู้เชี่ยวชาญ สะอาด ถูกสุขลักษณะ</p>
          </div>
        </div>
      </div>
    </div>

    <main class="container mx-auto px-4 py-16">
      <section id="category-section" class="mb-24">
        <div class="flex items-center justify-between mb-10">
            <h3 class="text-4xl font-black uppercase">Categories</h3>
            <p class="text-gray-400 text-sm hidden md:block">เลือกหมวดหมู่ที่ใช่</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <nuxt-link to="/category/อาหารจานเดียว" class="relative h-[400px] rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://img.kapook.com/fileupload_instant/images/food(2).jpg" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-3xl font-black mb-2">อาหารจานเดียว</h2>
              <span class="text-yellow-400 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">ดูเมนู →</span>
            </div>
          </nuxt-link>

          <nuxt-link to="/category/กับข้าว" class="relative h-[400px] rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://img.wongnai.com/p/1920x0/2019/08/09/38e7effed12846dda8803c5fb51bf539.jpg" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-3xl font-black mb-2">กับข้าว</h2>
              <span class="text-yellow-400 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">ดูเมนู →</span>
            </div>
          </nuxt-link>

          <nuxt-link to="/category/เซ็ทอาหาร" class="relative h-[400px] rounded-2xl overflow-hidden group shadow-lg">
            <img src="https://image.bangkokbiznews.com/image/kt/media/image/fileupload1/source/162054547482.jpg?1620545477927?x-image-process=style/lg-webp" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 class="text-white text-3xl font-black mb-2">เซ็ทอาหาร</h2>
              <span class="text-yellow-400 text-sm opacity-0 group-hover:opacity-100 transition transform translate-y-4 group-hover:translate-y-0">ดูเมนู →</span>
            </div>
          </nuxt-link>
        </div>
      </section>

      <div id="menu-section" class="flex items-end justify-between mb-10">
        <h3 class="text-3xl font-black uppercase">Recommended 🔥</h3>
        <nuxt-link to="/products" class="text-sm font-bold border-b-2 border-yellow-500 hover:text-gray-600 transition">ดูทั้งหมด</nuxt-link>
      </div>

      <div v-if="$fetchState.pending" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-yellow-500"></div>
      </div>

      <div v-else-if="$fetchState.error" class="text-center py-20 text-red-500">
        โหลดข้อมูลไม่สำเร็จ (ลองรีเฟรชใหม่นะ)
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <nuxt-link 
          v-for="product in products" 
          :key="product.id" 
          :to="`/product/${product.id}`"
          class="group cursor-pointer block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative w-full overflow-hidden aspect-w-1 aspect-h-1">
             <span v-if="product.stock_quantity > 0" class="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase">พร้อมส่ง</span>
             <span v-else class="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase">หมด</span>
            <img 
              :src="product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'" 
              class="h-64 w-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
          </div>
          <div class="p-4 flex justify-between items-start">
            <div>
              <h3 class="text-base font-bold text-gray-900 group-hover:text-yellow-600 transition line-clamp-1">{{ product.name }}</h3>
              <p class="text-xs text-gray-400 mt-1">{{ product.category }}</p>
            </div>
            <p class="text-lg font-black text-orange-600">฿{{ product.price }}</p>
          </div>
        </nuxt-link>
      </div>
    </main>

    <section class="bg-black py-20 px-4 rounded-t-[50px]">
      <div class="max-w-2xl mx-auto text-center text-white">
        <h3 class="text-3xl font-black mb-4 uppercase">รับส่วนลดพิเศษ</h3>
        <p class="text-gray-400 mb-8 font-light">ลงทะเบียนรับข่าวสารเพื่อรับคูปองส่วนลด 50 บาทสำหรับการสั่งซื้อครั้งแรก</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <input type="email" placeholder="อีเมลของคุณ" class="flex-1 px-6 py-4 rounded-full bg-gray-900 text-white border-none focus:ring-2 focus:ring-yellow-500 outline-none" />
          <button class="bg-yellow-500 text-black px-8 py-4 rounded-full font-bold uppercase hover:bg-yellow-400 transition">สมัครสมาชิก</button>
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
      // ดึงข้อมูลสินค้า 4 ตัวแรก
      const { data, error } = await this.$supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true })
        .limit(4)
      
      if (error) throw error
      this.products = data
    } catch (error) {
      console.error("Fetch Error:", error)
    }
  }
}
</script>