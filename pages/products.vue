<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-4xl font-black text-gray-900 tracking-tight">เมนูอาหารทั้งหมด</h1>
          <p class="text-gray-500 mt-2">เลือกสรรเมนูที่คุณชื่นชอบและสั่งได้ทันที</p>
        </div>
        <nuxt-link to="/checkout" class="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-orange-600 transition">
          🛒 ตะกร้าของฉัน ({{ cartCount }})
        </nuxt-link>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
        >
          <div class="relative overflow-hidden h-56">
            <img 
              :src="product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'" 
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div v-if="product.category" class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 uppercase tracking-widest">
              {{ product.category }}
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-1 truncate">{{ product.name }}</h3>
            <p class="text-gray-500 text-sm line-clamp-2 h-10 mb-4">{{ product.description }}</p>
            
            <div class="flex justify-between items-center mt-4">
              <div>
                <span class="text-xs text-gray-400 block uppercase font-bold">ราคา</span>
                <span class="text-2xl font-black text-orange-500">฿{{ Number(product.price).toLocaleString() }}</span>
              </div>
              
              <button 
                @click="addToCart(product)"
                class="bg-gray-900 text-white p-3 rounded-2xl hover:bg-orange-500 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && products.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-xl">ยังไม่มีสินค้าในขณะนี้...</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [],
      loading: true,
      // ตัวแปรสำหรับเลือก Option (กรณีทำ Modal เลือกก่อนใส่ตะกร้า)
      quantity: 1,
      cartCount: 0,
      selectedSpicy: 'ปกติ',
      addons: {
        cheese: false,
        egg: false
      }
    }
  },
  methods: {
    // 1. ดึงข้อมูลสินค้าจาก Supabase
    async fetchProducts() {
      try {
        this.loading = true
        const { data, error } = await this.$supabase
          .from('products')
          .select('*')
        if (error) throw error
        this.products = data
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    // 2. ฟังก์ชัน Add to Cart ที่ปรับปรุงใหม่
    addToCart(item) {
      let extraPrice = 0

      // คำนวณราคาพิเศษจาก Add-ons
      if (this.addons.cheese) extraPrice += 20
      if (this.addons.egg) extraPrice += 15

      // สร้าง Object สินค้าที่จะส่งเข้า Store
      const finalItem = {
        id: item.id,            // ID จาก Database
        name: item.name,        // ชื่อจาก Database
        image_url: item.image_url,
        quantity: this.quantity,
        spicy_level: this.selectedSpicy,
        addons: { ...this.addons },
        // สำคัญ: ราคาต่อหน่วย = ราคาฐานจาก DB + ราคาเสริม
        price: Number(item.price) + extraPrice 
      }

      // ส่งไปที่ Store (ตรวจสอบว่าใน store/cart.js ของคุณชื่อ action คือ addItem หรือ addToCart)
      this.$store.dispatch('cart/addItem', finalItem)

      // แจ้งเตือนสำเร็จ
      this.$swal.fire({
        icon: 'success',
        title: 'เพิ่มเมนูแล้ว 🍜',
        text: `${item.name} x${this.quantity}`,
        showConfirmButton: false,
        timer: 1500
      })
      
      // Reset ค่า (ถ้าจำเป็น)
      this.quantity = 1
      this.addons.cheese = false
      this.addons.egg = false
    }
  },
  async mounted() {
    await this.fetchProducts()
  }
}

</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>