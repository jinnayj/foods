<template>
  <div class="container mx-auto px-4 py-16 text-center max-w-md">
    <h1 class="text-3xl font-black mb-2">SCAN TO PAY</h1>
    <p class="text-gray-500 mb-8">กรุณาสแกน QR Code เพื่อชำระเงิน</p>

    <div class="bg-white p-6 rounded-2xl shadow-lg border inline-block mb-8">
      <img src="/pays.png" alt="Payment QR Code" class="w-full max-w-[280px] mx-auto rounded-lg border" />
      
      <div class="mt-6 pt-4 border-t">
        <p class="text-gray-500 text-sm">ยอดชำระทั้งหมด</p>
        <p class="text-3xl font-bold text-black mt-1">฿{{ amount }}</p>
        <p class="text-xs text-gray-400 mt-1">Order ID: #{{ orderId }}</p>
      </div>
    </div>

    <div>
        <p class="text-sm text-gray-400 mb-4">* เมื่อโอนเงินเสร็จแล้ว กดปุ่มด้านล่างเพื่อยืนยัน</p>
        <button 
          @click="confirmPayment"
          :disabled="loading"
          class="block w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg disabled:bg-gray-400"
        >
            {{ loading ? 'กำลังตรวจสอบ...' : 'แจ้งชำระเงินเรียบร้อย' }}
        </button>
    </div>
  </div>
</template>

<script>
export default {
  // รับค่า Amount และ Order ID จาก URL
  asyncData({ query }) {
    return {
      amount: Number(query.amount || 0).toLocaleString(),
      orderId: query.order_id
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async confirmPayment() {
      if (!this.orderId) return
      
      this.loading = true
      try {
        // อัปเดตสถานะออเดอร์เป็น 'paid' (จ่ายแล้ว)
        const { error } = await this.$supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', this.orderId)

        if (error) throw error

        // แจ้งเตือนสำเร็จ
        await this.$swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ!',
          text: 'ทางเราจะรีบจัดส่งสินค้าให้เร็วที่สุดครับ',
          confirmButtonColor: '#000'
        })

        // กลับหน้าแรก
        this.$router.push('/')

      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: error.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>