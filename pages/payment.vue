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
เพื่อให้เข้าใจง่ายที่สุด ผมจะเขียนสคริปต์หน้า payment.vue ให้ใหม่ โดยเปลี่ยนชื่อตัวแปรให้ตรงกับคำว่า total_amount ตามที่คุณต้องการ เพื่อให้ตรงกับชื่อคอลัมน์ในฐานข้อมูล จะได้ไม่งงครับ

นี่คือโค้ดฉบับเต็มครับ:

ข้อมูลโค้ด
<template>
  <div class="container mx-auto px-4 py-16 text-center max-w-md">
    <h1 class="text-3xl font-black mb-2 uppercase">Scan to Pay</h1>
    <p class="text-gray-500 mb-8">กรุณาสแกน QR Code เพื่อชำระเงิน</p>

    <div class="bg-white p-6 rounded-2xl shadow-lg border inline-block mb-8 w-full">
      <img 
        src="/pays.png" 
        alt="Payment QR Code" 
        class="w-full max-w-[280px] mx-auto rounded-lg border mb-4" 
      />
      
      <div class="mt-6 pt-4 border-t border-gray-100">
        <p class="text-gray-500 text-sm">ยอดชำระทั้งหมด</p>
        <p class="text-4xl font-bold text-black mt-1">
          ฿{{ formattedAmount }}
        </p>
        <p class="text-xs text-gray-400 mt-2 font-mono">
          Order ID: #{{ orderId || 'ไม่พบหมายเลข' }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <p class="text-sm text-gray-400 italic">
        * เมื่อโอนเงินเสร็จแล้ว กรุณากดปุ่มเพื่อยืนยันการชำระเงิน
      </p>
      
      <button 
        @click="confirmPayment"
        :disabled="loading || !orderId"
        class="block w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg disabled:bg-gray-400"
      >
        {{ loading ? 'กำลังตรวจสอบระบบ...' : 'แจ้งชำระเงินเรียบร้อย' }}
      </button>

      <button @click="$router.push('/')" class="text-gray-400 text-sm hover:underline">
        ยกเลิกรายการ
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      // ใช้ชื่อเดียวกับ Database เพื่อกันงง
      total_amount: 0, 
      orderId: null
    }
  },

  // ใช้ mounted เพื่อดึงค่าจาก URL เมื่อโหลดหน้าเสร็จ
  mounted() {
    this.initPayment()
  },

  computed: {
    // ฟังก์ชันจัดรูปแบบตัวเลขให้สวยงาม
    formattedAmount() {
      return Number(this.total_amount).toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  },

  methods: {
    initPayment() {
      // ดึงค่าจาก URL Query เช่น ?amount=500&order_id=...
      const amountFromUrl = this.$route.query.amount
      const idFromUrl = this.$route.query.order_id

      if (amountFromUrl) {
        this.total_amount = amountFromUrl
      }
      
      if (idFromUrl) {
        this.orderId = idFromUrl
      }

      // ตรวจสอบค่าใน Console (กด F12 ดูได้)
      console.log('ข้อมูลที่ได้รับ:', {
        total_amount: this.total_amount,
        orderId: this.orderId
      })
    },

    async confirmPayment() {
      if (!this.orderId) return
      
      this.loading = true
      try {
        // อัปเดตสถานะในตาราง orders
        const { error } = await this.$supabase
          .from('orders')
          .update({ status: 'paid' })
          .eq('id', this.orderId)

        if (error) throw error

        await this.$swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ!',
          text: 'เราได้รับข้อมูลการโอนเงินของท่านแล้ว',
          confirmButtonColor: '#000'
        })

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