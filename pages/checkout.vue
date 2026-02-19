<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
    <div class="container mx-auto max-w-2xl">

      <h1 class="text-3xl font-black mb-8 text-center tracking-tight">
        ยืนยันคำสั่งอาหาร 🍽️
      </h1>

      <div class="bg-white rounded-2xl p-8 shadow-xl">

        <h2 class="text-xl font-bold mb-6">
          ข้อมูลสำหรับจัดส่ง
        </h2>

        <form @submit.prevent="submitOrder" class="space-y-4">

          <!-- ชื่อ -->
          <div>
            <label class="block text-sm font-bold mb-2">ชื่อผู้รับ</label>
            <input
              v-model="form.name"
              required
              type="text"
              class="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="สมชาย ใจดี"
            />
          </div>

          <!-- เบอร์โทร -->
          <div>
            <label class="block text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
            <input
              v-model="form.phone"
              required
              type="tel"
              class="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="08X-XXX-XXXX"
            />
          </div>

          <!-- ประเภทการรับ -->
          <div>
            <label class="block text-sm font-bold mb-2">วิธีรับอาหาร</label>
            <select
              v-model="form.delivery_type"
              class="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="delivery">จัดส่งถึงบ้าน</option>
              <option value="pickup">รับที่ร้าน</option>
            </select>
          </div>

          <!-- ที่อยู่ (แสดงเมื่อเลือก delivery) -->
          <div v-if="form.delivery_type === 'delivery'">
            <label class="block text-sm font-bold mb-2">ที่อยู่จัดส่ง</label>
            <textarea
              v-model="form.address"
              required
              rows="3"
              class="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="บ้านเลขที่ / ถนน / แขวง / เขต"
            ></textarea>
          </div>

          <!-- หมายเหตุ -->
          <div>
            <label class="block text-sm font-bold mb-2">
              หมายเหตุถึงร้าน (ถ้ามี)
            </label>
            <textarea
              v-model="form.note"
              rows="2"
              class="w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="เช่น ไม่ใส่ผัก / เพิ่มเผ็ด"
            ></textarea>
          </div>

          <!-- สรุปราคา -->
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

  <button
    type="submit"
    :disabled="loading"
    class="group relative w-full flex items-center justify-center py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_15px_30px_-10px_rgba(249,115,22,0.5)] transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.6)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed overflow-hidden"
  >
    <div class="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>

    <div class="relative flex items-center gap-3">
      <svg v-if="loading" class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <span v-else class="text-gray-600 font-medium">ตกลง</span>
      <span class="text-xl font-black tracking-wide">
        {{ loading ? 'กำลังบันทึกออเดอร์...' : 'ยืนยันการสั่งอาหาร' }}
      </span>
    </div>
  </button>
  
  <p class="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
    By clicking confirm, you agree to our terms of service.
  </p>
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
    cartItems() {
      return this.$store.state.cart.items
    },
    totalPrice() {
      return this.$store.getters['cart/totalPrice']
    }
  },

  methods: {
    async submitOrder() {

      if (this.cartItems.length === 0) {
        return this.$swal.fire({
          icon: 'warning',
          title: 'ตะกร้าอาหารว่างเปล่า 🍜'
        })
      }

      const { data: { user } } = await this.$supabase.auth.getUser()
      if (!user) return this.$router.push('/login')

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
            total_price: this.totalPrice,
            items: this.cartItems,
            status: 'pending'
          })
          .select()

        if (error) throw error

        const orderId = data[0].id

        await this.$store.dispatch('cart/clearCart')

        this.$swal.close()

        this.$router.push(`/payment?amount=${this.totalPrice}&order_id=${orderId}`)

      } catch (err) {
        this.$swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
