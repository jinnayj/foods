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
  // บังคับล็อกอินก่อนเข้าหน้านี้ (Middleware)
  middleware({ store, redirect }) {
    // ถ้าไม่มี User ให้เด้งไปหน้า Login
    const user = store.$supabase.auth.getUser()
    if (!user) {
      return redirect('/login')
    }
  },
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
      if (this.cartItems.length === 0) {
         this.$swal.fire({ icon: 'warning', title: 'ตะกร้าว่างเปล่า!', confirmButtonColor: '#000' })
         return
      }

      // ดึงข้อมูล User ปัจจุบัน
      const { data: { user } } = await this.$supabase.auth.getUser()
      if (!user) return this.$router.push('/login')
      
      // Loading
      this.$swal.fire({
        title: 'กำลังบันทึกออเดอร์...',
        allowOutsideClick: false,
        didOpen: () => {
          this.$swal.showLoading()
        }
      })
      
      this.loading = true
try {
        const finalPrice = this.totalPrice

        // 1. บันทึกลง Supabase (เพิ่ม .select() ต่อท้ายเพื่อขอ ID กลับมา)
        const { data, error } = await this.$supabase.from('orders').insert({
          user_id: user.id,
          customer_name: this.form.name,
          address: this.form.address,
          phone: this.form.phone,
          total_price: finalPrice,
          items: this.cartItems,
          status: 'pending' // สถานะเริ่มต้น
        })
        .select() // <--- สำคัญ! ต้องมีบรรทัดนี้ถึงจะได้ ID กลับมา

        if (error) throw error

        // ได้ Order ID มาแล้ว
        const newOrderId = data[0].id

        // 2. ล้างตะกร้า
        await this.$store.dispatch('cart/clearCart')
        
        // 3. ไปหน้าจ่ายเงิน (ส่ง order_id ไปด้วย)
        this.$swal.close()
        this.$router.push(`/payment?amount=${finalPrice}&order_id=${newOrderId}`)

      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.message,
          confirmButtonColor: '#d33'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>