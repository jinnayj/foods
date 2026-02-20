<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
    <div class="container mx-auto max-w-2xl">
      <h1 class="text-3xl font-black mb-8 text-center tracking-tight">ยืนยันคำสั่งอาหาร 🍽️</h1>

      <div class="bg-white rounded-2xl p-8 shadow-xl">
        <h2 class="text-xl font-bold mb-6">ข้อมูลสำหรับจัดส่ง</h2>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2">ชื่อผู้รับ</label>
            <input v-model="form.name" required type="text"
              class="w-full border p-3 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="สมชาย ใจดี" />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
            <input v-model="form.phone" required type="tel"
              class="w-full border p-3 rounded-md focus:ring-2 focus:ring-orange-500" placeholder="08X-XXX-XXXX" />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">วิธีรับอาหาร</label>
            <select v-model="form.delivery_type"
              class="w-full border p-3 rounded-md focus:ring-2 focus:ring-orange-500">
              <option value="delivery">จัดส่งถึงบ้าน</option>
              <option value="pickup">รับที่ร้าน</option>
            </select>
          </div>

          <div v-if="form.delivery_type === 'delivery'">
            <label class="block text-sm font-bold mb-2">ที่อยู่จัดส่ง</label>
            <textarea v-model="form.address" required rows="3"
              class="w-full border p-3 rounded-md focus:ring-2 focus:ring-orange-500"
              placeholder="บ้านเลขที่ / ถนน / แขวง / เขต"></textarea>
          </div>

          <div class="mt-10 pt-6 border-t border-dashed border-gray-200">
            <div class="flex justify-between items-end mb-8">
              <div>
                <p class="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Total Amount</p>
                <p class="text-gray-600 font-medium">ยอดรวมสุทธิ</p>
              </div>
              <div class="text-right">
                <span class="text-4xl font-black text-gray-900 tracking-tighter">
                  <span class="text-lg font-bold text-orange-500 mr-1">฿</span>{{ totalPrice.toLocaleString() }}
                </span>
              </div>
            </div>

            <button type="submit" :disabled="loading"
              class="w-full py-4 px-6 rounded-2xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 shadow-lg transition-all disabled:bg-gray-400">
              {{ loading ? 'กำลังบันทึกออเดอร์...' : 'ยืนยันการสั่งอาหาร' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async middleware({ app, redirect }) {
    const { data: { user } } = await app.$supabase.auth.getUser()
    if (!user) return redirect('/login')
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        phone: '',
        address: '',
        note: '',
        delivery_type: 'delivery'
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
        return this.$swal.fire({ icon: 'warning', title: 'ตะกร้าอาหารว่างเปล่า 🍜' })
      }

      const { data: { user } } = await this.$supabase.auth.getUser()
      if (!user) return this.$router.push('/login')

      // --- จุดสำคัญ: เก็บค่าราคาไว้ก่อนล้างตะกร้า ---
      const finalPrice = this.totalPrice
      this.loading = true

      this.$swal.fire({
        title: 'กำลังส่งออเดอร์ไปที่ครัว 👨‍🍳',
        allowOutsideClick: false,
        didOpen: () => this.$swal.showLoading()
      })

      try {
        const { data, error } = await this.$supabase
          .from('orders')
          .insert({
            user_id: user.id,
            customer_name: this.form.name,
            phone: this.form.phone,
            address: this.form.delivery_type === 'delivery' ? this.form.address : null,
            note: this.form.note,
            delivery_type: this.form.delivery_type,
            total_amount: finalPrice, // ใช้ค่าที่ฝากไว้
            items: this.cartItems,
            status: 'pending'
          })
          .select()

        if (error) throw error

        const orderId = data[0].id

        // ล้างตะกร้า (ราคากลายเป็น 0 ใน Store แต่ไม่มีผลกับ finalPrice)
        await this.$store.dispatch('cart/clearCart')

        this.$swal.close()

        // ส่ง finalPrice ไปที่หน้า payment
        this.$router.push(`/payment?amount=${finalPrice}&order_id=${orderId}`)

      } catch (err) {
        this.$swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>