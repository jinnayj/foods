<template>
  <div class="font-sans text-gray-900">
    <div class="container mx-auto px-4 py-10">
      <nuxt-link to="/" class="inline-flex items-center text-gray-500 hover:text-black mb-6">
        ← กลับไปหน้าแรก
      </nuxt-link>

      <div v-if="!product" class="text-center py-20 text-red-500">
        ไม่พบข้อมูลสินค้า
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div class="bg-gray-100 rounded-xl overflow-hidden shadow-sm aspect-w-1 aspect-h-1">
          <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover object-center" />
        </div>

        <div>
          <p class="text-sm text-gray-500 mb-2">{{ product.category }}'s Shoes</p>
          <h1 class="text-4xl font-black mb-4">{{ product.name }}</h1>
          <p class="text-2xl font-bold mb-6">฿{{ product.price.toLocaleString() }}</p>

          <p class="text-gray-600 mb-8 leading-relaxed">
            {{ product.description || 'รองเท้าดีไซน์สุดล้ำ ใส่สบาย พร้อมลุยทุกสถานการณ์ ผลิตจากวัสดุคุณภาพสูง ระบายอากาศได้ดีเยี่ยม...' }}
          </p>

          <div class="mb-8">
            <h3 class="font-bold mb-3">Select Size</h3>
            <div class="grid grid-cols-4 gap-2">
              <button 
                v-for="size in [7, 8, 9, 10, 11, 12]" 
                :key="size" 
                @click="selectedSize = size"
                :class="[
                  'border py-3 rounded transition', 
                  selectedSize === size ? 'bg-black text-white border-black' : 'hover:border-black hover:bg-gray-50 bg-white'
                ]"
              >
                US {{ size }}
              </button>
            </div>
            <p v-if="showSizeError" class="text-red-500 text-sm mt-2">
              * กรุณาเลือกไซส์ก่อนสั่งซื้อ
            </p>
          </div>

          <button 
            @click="addToCart"
            class="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 1. ดึงข้อมูลสินค้า (ทำงานฝั่ง Server)
  async asyncData({ params, $supabase, error }) {
    try {
      const { data, error: dbError } = await $supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (dbError) throw dbError
      
      return { product: data }
    } catch (e) {
      error({ statusCode: 404, message: 'Product not found' })
    }
  },

  // 2. ตัวแปรเก็บค่า (State)
  data() {
    return {
      selectedSize: null, // เก็บไซส์ที่ลูกค้าเลือก
      showSizeError: false // ควบคุมการแสดงข้อความเตือน
    }
  },

  // 3. ฟังก์ชันการทำงาน (Methods)
  methods: {
    addToCart() {
      // เช็คว่าเลือกไซส์หรือยัง
      if (!this.selectedSize) {
        this.showSizeError = true
        return
      }
      this.showSizeError = false
      
      // เตรียมข้อมูลสินค้า
      const item = {
        ...this.product,
        size: this.selectedSize
      }
      
      // ส่งเข้า Vuex Store
      this.$store.commit('cart/ADD_ITEM', item)
      
      // แจ้งเตือน
      alert(`เพิ่ม ${this.product.name} (Size ${this.selectedSize}) ลงตะกร้าแล้ว!`)
    }
  }
}
</script>