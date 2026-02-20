<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="container mx-auto max-w-4xl">

      <div class="mb-10 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Order History</h1>
          <p class="text-gray-500">ประวัติการสั่งซื้อทั้งหมดของคุณ</p>
        </div>
        <nuxt-link to="/" class="text-sm font-bold text-orange-500 hover:underline">
          กลับไปหน้าหลัก
        </nuxt-link>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p class="text-gray-500">กำลังโหลดประวัติออเดอร์...</p>
      </div>

      <div v-else-if="orders.length === 0"
        class="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
        <p class="text-gray-400 text-lg mb-6">คุณยังไม่มีประวัติการสั่งซื้อ</p>
        <nuxt-link to="/products" class="bg-black text-white px-8 py-3 rounded-full font-bold">
          สั่งอาหารเลย
        </nuxt-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id"
          class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b">
            <div class="flex items-center gap-4">
              <span class="bg-white border px-3 py-1 rounded-lg text-xs font-mono font-bold">
                #{{ displayId(order.id) }}
              </span>
              <span class="text-gray-400 text-xs">
                {{ formatDate(order.created_at) }}
              </span>
            </div>

            <div :class="getStatusClass(order.status)"
              class="px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Items Summary</h4>
                <ul class="space-y-3">
                  <li v-for="(item, index) in parseItems(order.items)" :key="index" class="flex justify-between text-sm">
                    <span class="text-gray-700">
                      <span class="font-bold text-orange-500">{{ item.quantity || item.qty || 0 }}x</span>
                      {{ item.name || item.product_name || 'ไม่มีชื่อรายการ' }}
                      <span v-if="item.spicy_level" class="text-[10px] bg-red-50 text-red-500 px-1 rounded ml-1">
                        {{ item.spicy_level }}
                      </span>
                    </span>
                    <span class="font-medium">
                      ฿{{ calculateItemTotal(item) }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="bg-gray-50 rounded-2xl p-4">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Delivery Info</h4>
                <p class="text-sm font-bold text-gray-900 mb-1">{{ order.customer_name || 'ไม่ระบุชื่อ' }}</p>
                <p class="text-xs text-gray-500 mb-2">{{ order.phone || 'ไม่ระบุเบอร์' }}</p>
                <p class="text-xs text-gray-600 italic leading-relaxed">
                  {{ order.address || 'รับที่ร้าน' }}
                </p>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t flex justify-between items-end">
              <div>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Amount</p>
                <p class="text-3xl font-black text-gray-900">
                  ฿{{ Number(order.total_amount || 0).toLocaleString() }}
                </p>
              </div>

              <button v-if="order.status === 'pending' || !order.status" @click="goToPayment(order)"
                class="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition">
                ไปหน้าชำระเงิน
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  // แก้ไข Middleware ให้ใช้ getSession เพื่อป้องกันการหลุดตอน refresh
  async middleware({ $supabase, redirect }) {
    const { data: { session } } = await $supabase.auth.getSession()
    if (!session) return redirect('/login')
  },

  data() {
    return {
      orders: [],
      loading: true
    }
  },

  async mounted() {
    await this.fetchOrders()
  },

  methods: {
    async fetchOrders() {
      try {
        this.loading = true
        // ดึง session ปัจจุบันเพื่อให้ชัวร์ว่า user ยังอยู่
        const { data: { session } } = await this.$supabase.auth.getSession()
        if (!session) throw new Error('Session expired')

        const { data, error } = await this.$supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id) // ใช้ ID จาก session
          .order('created_at', { ascending: false })

        if (error) throw error
        this.orders = data || []
      } catch (err) {
        console.error('Error:', err.message)
        this.$swal.fire('ผิดพลาด', 'ไม่สามารถโหลดประวัติการสั่งซื้อได้', 'error')
      } finally {
        this.loading = false
      }
    },

    // ✅ ฟังก์ชันสำคัญ: แปลง String เป็น Array ของสินค้า
    parseItems(itemsData) {
      if (!itemsData) return []
      if (Array.isArray(itemsData)) return itemsData
      try {
        return JSON.parse(itemsData)
      } catch (e) {
        console.error("Parse error:", e)
        return []
      }
    },

    calculateItemTotal(item) {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity || item.qty) || 0
      return (price * qty).toLocaleString()
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateString).toLocaleDateString('th-TH', options)
    },

    getStatusClass(status) {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-600'
        case 'shipped': return 'bg-blue-100 text-blue-600'
        case 'pending': return 'bg-yellow-100 text-yellow-600'
        default: return 'bg-gray-100 text-gray-600'
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'paid': return 'ชำระเงินแล้ว'
        case 'shipped': return 'จัดส่งแล้ว'
        case 'pending': return 'รอการชำระเงิน'
        default: return 'รอดำเนินการ'
      }
    },

    displayId(id) {
      if (!id) return ''
      return String(id).slice(-8).toUpperCase()
    },

    goToPayment(order) {
      this.$router.push(`/payment?amount=${order.total_amount}&order_id=${order.id}`)
    }
  }
}
</script>