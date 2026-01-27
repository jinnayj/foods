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
            {{ product.description || 'รองเท้าดีไซน์สุดล้ำ ใส่สบาย พร้อมลุยทุกสถานการณ์ ผลิตจากวัสดุคุณภาพสูง...' }}
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
  // 1. ดึงข้อมูลสินค้า
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

  // 2. ตัวแปร State
  data() {
    return {
      selectedSize: null
    }
  },

  // 3. ฟังก์ชันการทำงาน
  methods: {
    addToCart() {
      // แจ้งเตือนถ้าลืมเลือกไซส์ (SweetAlert2)
      if (!this.selectedSize) {
        this.$swal.fire({
          icon: 'warning',
          title: 'ลืมอะไรไปรึเปล่า?',
          text: 'กรุณาเลือกไซส์ก่อนกดสั่งซื้อนะครับ',
          confirmButtonColor: '#000000'
        })
        return
      }
      
      const item = {
        ...this.product,
        size: this.selectedSize
      }
      
      this.$store.dispatch('cart/addItem', item)
      
      // แจ้งเตือนสำเร็จ (SweetAlert2)
      this.$swal.fire({
        icon: 'success',
        title: 'เรียบร้อย!',
        text: `เพิ่ม ${this.product.name} ลงตะกร้าแล้ว`,
        showConfirmButton: false,
        timer: 1500
      })
    }
  }
}
</script>