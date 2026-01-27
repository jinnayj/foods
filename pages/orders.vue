<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <h1 class="text-3xl font-black mb-8 uppercase tracking-tighter">My Orders</h1>

    <div v-if="$fetchState.pending" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-20 bg-gray-50 rounded-xl">
      <p class="text-xl text-gray-500 mb-4">คุณยังไม่มีรายการสั่งซื้อ</p>
      <nuxt-link to="/" class="text-black font-bold border-b-2 border-black hover:text-gray-600">ไปช้อปปิ้งกันเถอะ</nuxt-link>
    </div>

    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
        
        <div class="bg-gray-50 px-6 py-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Order ID</p>
            <p class="font-mono text-sm">#{{ order.id }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Date</p>
            <p class="text-sm">{{ formatDate(order.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold">Total</p>
            <p class="font-bold">฿{{ order.total_price.toLocaleString() }}</p>
          </div>
          
          <div :class="getStatusColor(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {{ order.status }}
          </div>
        </div>

        <div class="p-6">
          <div v-for="(item, index) in order.items" :key="index" class="flex gap-4 mb-4 last:mb-0">
            <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
              <img :src="item.image_url" class="w-full h-full object-cover" />
            </div>
            
            <div class="flex-1">
              <h4 class="font-bold text-sm">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">Size: US {{ item.size }}</p>
              <p class="text-sm font-medium mt-1">฿{{ item.price.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div v-if="order.status === 'pending'" class="px-6 pb-6 text-right">
             <nuxt-link 
               :to="`/payment?amount=${order.total_price}&order_id=${order.id}`"
               class="inline-block bg-black text-white text-sm px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
             >
               ชำระเงินตอนนี้
             </nuxt-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  // บังคับล็อกอิน
  middleware({ store, redirect }) {
    if (!store.$supabase.auth.getUser()) {
      return redirect('/login')
    }
  },
  data() {
    return {
      orders: []
    }
  },
  async fetch() {
    try {
      // ดึงข้อมูล User
      const { data: { user } } = await this.$supabase.auth.getUser()
      if (!user) return

      // ดึงออเดอร์ของ User คนนี้ (เรียงจากใหม่ไปเก่า)
      const { data, error } = await this.$supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      this.orders = data

    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    // แปลงวันที่ให้สวยงาม
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    },
    // เลือกสีป้ายสถานะ
    getStatusColor(status) {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800'     // จ่ายแล้ว: สีเขียว
        case 'shipped': return 'bg-blue-100 text-blue-800'    // ส่งแล้ว: สีฟ้า
        case 'pending': return 'bg-yellow-100 text-yellow-800' // รอจ่าย: สีเหลือง
        case 'cancelled': return 'bg-red-100 text-red-800'    // ยกเลิก: สีแดง
        default: return 'bg-gray-100 text-gray-800'
      }
    }
  }
}
</script>