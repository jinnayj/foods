<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl min-h-screen bg-gray-50">
    <h1 class="text-3xl font-black mb-8 uppercase tracking-tighter">
      ประวัติการสั่งซื้อ
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-yellow-500"></div>
    </div>

    <!-- Empty -->
    <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm">
      <div class="text-6xl mb-4">🍽️</div>
      <p class="text-xl text-gray-500 mb-6 font-light">
        คุณยังไม่เคยสั่งเมนูอร่อยกับเราเลย
      </p>
      <nuxt-link
        to="/"
        class="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition shadow-md"
      >
        สั่งอาหารมื้อแรกเลย
      </nuxt-link>
    </div>

    <!-- Orders -->
    <div v-else class="space-y-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition"
      >
        <!-- Header -->
        <div class="bg-gray-100/50 px-6 py-4 border-b flex flex-col md:flex-row justify-between gap-4">
          <div class="flex gap-6">
            <div>
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">Order ID</p>
              <p class="font-mono text-xs text-gray-700">
                #{{ order.id.slice(0, 8) }}...
              </p>
            </div>

            <div>
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">วันที่สั่ง</p>
              <p class="text-xs text-gray-700">
                {{ formatDate(order.created_at) }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div class="text-right">
              <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">ยอดรวม</p>
              <p class="font-black text-orange-600">
                ฿{{ formatPrice(order.total_price) }}
              </p>
            </div>

            <div
              :class="getStatusColor(order.status)"
              class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            >
              {{ translateStatus(order.status) }}
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="p-6">
          <div
            v-for="(item, index) in order.items"
            :key="index"
            class="flex items-center gap-4 mb-4 last:mb-0"
          >
            <div class="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden">
              <img
                :src="item.image_url || 'https://via.placeholder.com/100'"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="flex-1">
              <h4 class="font-bold text-sm text-gray-800">
                {{ item.name }}
              </h4>
              <p class="text-xs text-gray-500">
                จำนวน: {{ item.quantity || 1 }} รายการ
              </p>
            </div>

            <p class="text-sm font-bold text-gray-900">
              ฿{{ formatPrice(item.price * (item.quantity || 1)) }}
            </p>
          </div>
        </div>

        <!-- Pay Button -->
        <div
          v-if="order.status === 'pending'"
          class="px-6 pb-6 text-right"
        >
          <nuxt-link
            :to="`/payment?amount=${order.total_price}&order_id=${order.id}`"
            class="inline-block bg-black text-yellow-400 text-xs px-8 py-2.5 rounded-full font-black hover:bg-gray-800 transition uppercase tracking-widest shadow-lg"
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
  async middleware({ app, redirect }) {
    const { data: { user } } = await app.$supabase.auth.getUser()
    if (!user) return redirect('/login')
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
        const { data: { user } } = await this.$supabase.auth.getUser()
        if (!user) return

        const { data, error } = await this.$supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        this.orders = data || []

      } catch (err) {
        console.error('Fetch Orders Error:', err)
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatPrice(price) {
      return Number(price || 0).toLocaleString()
    },

    translateStatus(status) {
      const map = {
        pending: 'รอชำระเงิน',
        paid: 'รับออเดอร์แล้ว',
        preparing: 'กำลังปรุงอาหาร',
        shipped: 'กำลังไปส่ง',
        delivered: 'ส่งสำเร็จ',
        cancelled: 'ยกเลิกแล้ว'
      }
      return map[status] || status
    },

    getStatusColor(status) {
      switch (status) {
        case 'paid':
        case 'delivered':
          return 'bg-green-500 text-white'
        case 'preparing':
        case 'shipped':
          return 'bg-blue-500 text-white'
        case 'pending':
          return 'bg-yellow-400 text-black'
        case 'cancelled':
          return 'bg-red-500 text-white'
        default:
          return 'bg-gray-200 text-gray-700'
      }
    }
  }
}
</script>
