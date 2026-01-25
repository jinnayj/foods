<template>
  <div class="container mx-auto px-4 py-16 text-center max-w-md">
    <h1 class="text-3xl font-black mb-2">SCAN TO PAY</h1>
    <p class="text-gray-500 mb-8">กรุณาสแกน QR Code เพื่อชำระเงิน</p>

    <div class="bg-white p-6 rounded-2xl shadow-lg border inline-block mb-8">
      <img src="/pays.png" alt="Payment QR Code" class="w-full max-w-[280px] mx-auto rounded-lg border" />
      
      <div class="mt-6 pt-4 border-t">
        <p class="text-gray-500 text-sm">ยอดชำระทั้งหมด</p>
        <p class="text-3xl font-bold text-black mt-1">฿{{ amount }}</p>
      </div>
    </div>

    <div>
        <p class="text-sm text-gray-400 mb-4">* เมื่อโอนเงินเสร็จแล้ว กดปุ่มด้านล่างเพื่อยืนยัน</p>
        <nuxt-link to="/" class="block w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition transform active:scale-95 shadow-lg">
            แจ้งชำระเงินเรียบร้อย
        </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  // รับค่ายอดเงินที่ส่งมาจากหน้า Checkout
  asyncData({ query }) {
    return {
      amount: Number(query.amount || 0).toLocaleString()
    }
  }
}
</script>