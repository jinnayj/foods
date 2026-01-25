<template>
  <div class="container mx-auto px-4 py-10 max-w-2xl">
    <h1 class="text-3xl font-black mb-8 text-center">CHECKOUT</h1>

    <div class="bg-white border rounded-xl p-8 shadow-sm">
      <h2 class="text-xl font-bold mb-6">Shipping Address</h2>
      
      <form @submit.prevent="submitOrder" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
          <input v-model="form.name" required type="text" class="w-full border p-3 rounded focus:outline-none focus:border-black" placeholder="John Doe">
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <textarea v-model="form.address" required rows="3" class="w-full border p-3 rounded focus:outline-none focus:border-black" placeholder="123 Street, City..."></textarea>
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <input v-model="form.phone" required type="tel" class="w-full border p-3 rounded focus:outline-none focus:border-black" placeholder="081-234-5678">
        </div>

        <div class="border-t pt-6 mt-6">
          <div class="flex justify-between items-center mb-6">
            <span class="text-gray-600">Total Amount</span>
            <span class="text-2xl font-black">฿{{ totalPrice.toLocaleString() }}</span>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {{ loading ? 'Processing...' : 'Confirm Order' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        address: '',
        phone: ''
      }
    }
  },
  computed: {
    cartItems() { return this.$store.state.cart.items },
    totalPrice() { return this.$store.getters['cart/totalPrice'] }
  },
  methods: {
    async submitOrder() {
      if (this.cartItems.length === 0) return alert('ตะกร้าว่างเปล่า!')
      
      this.loading = true
      try {
        // 1. สำคัญ: เก็บราคาสุทธิไว้ในตัวแปรก่อน (เพราะเดี๋ยวเราจะล้างตะกร้า ทำให้ totalPrice กลายเป็น 0)
        const finalPrice = this.totalPrice

        // 2. บันทึกลง Supabase
        const { error } = await this.$supabase.from('orders').insert({
          customer_name: this.form.name,
          address: this.form.address,
          phone: this.form.phone,
          total_price: finalPrice, // ใช้ค่าที่เก็บไว้
          items: this.cartItems 
        })

        if (error) throw error

        // 3. สำเร็จ: ล้างตะกร้า
        this.$store.commit('cart/CLEAR_CART')
        
        // 4. ส่งลูกค้าไปหน้าจ่ายเงิน (Payment) พร้อมแนบยอดเงินไปด้วย
        this.$router.push(`/payment?amount=${finalPrice}`)

      } catch (err) {
        alert('เกิดข้อผิดพลาด: ' + err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>