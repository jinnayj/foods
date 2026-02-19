<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12 px-4">
    <div class="container mx-auto max-w-6xl">

      <h1 class="text-3xl font-black mb-10 tracking-tight">
        ตะกร้าอาหารของคุณ 🍽️
      </h1>

      <!-- EMPTY CART -->
      <div v-if="cartItems.length === 0"
           class="text-center py-20 bg-white rounded-3xl shadow-lg">

        <div class="text-6xl mb-4">🍜</div>
        <p class="text-xl text-gray-500 mb-6">
          ยังไม่มีเมนูในตะกร้าเลย
        </p>

        <nuxt-link
          to="/"
          class="inline-block bg-orange-500 text-white px-10 py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-lg"
        >
          เลือกเมนูอร่อยกันเลย
        </nuxt-link>
      </div>

      <!-- CART ITEMS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <!-- LEFT: ITEMS -->
        <div class="lg:col-span-2 space-y-6">

          <div
            v-for="(item, index) in cartItems"
            :key="index"
            class="flex gap-4 bg-white p-5 rounded-2xl shadow-md"
          >

            <!-- IMAGE -->
            <div class="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden">
              <img
                :src="item.image_url || 'https://via.placeholder.com/150'"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- INFO -->
            <div class="flex-1 flex flex-col justify-between">

              <div>
                <div class="flex justify-between">
                  <h3 class="font-bold text-lg">
                    {{ item.name }}
                  </h3>

                  <p class="font-black text-orange-600">
                    ฿{{ (item.price * item.quantity).toLocaleString() }}
                  </p>
                </div>

                <p class="text-gray-400 text-sm mt-1">
                  ฿{{ item.price.toLocaleString() }} / จาน
                </p>
              </div>

              <!-- QUANTITY CONTROL -->
              <div class="flex items-center justify-between mt-4">

                <div class="flex items-center gap-3">

                  <button
                    @click="decreaseQty(index)"
                    class="w-8 h-8 rounded-full bg-gray-200 font-bold"
                  >
                    -
                  </button>

                  <span class="font-bold">
                    {{ item.quantity }}
                  </span>

                  <button
                    @click="increaseQty(index)"
                    class="w-8 h-8 rounded-full bg-orange-500 text-white font-bold"
                  >
                    +
                  </button>

                </div>

                <button
                  @click="removeItem(index)"
                  class="text-red-500 text-sm font-bold hover:underline"
                >
                  ลบ
                </button>

              </div>

            </div>
          </div>

        </div>

        <!-- RIGHT: SUMMARY -->
        <div class="bg-white p-8 rounded-3xl shadow-xl h-fit sticky top-24">

          <h2 class="text-xl font-bold mb-6 border-b pb-4">
            สรุปรายการสั่งอาหาร
          </h2>

          <div class="space-y-4 mb-6">

            <div class="flex justify-between">
              <span>ค่าอาหาร</span>
              <span>฿{{ totalPrice.toLocaleString() }}</span>
            </div>

            <div class="flex justify-between">
              <span>ค่าจัดส่ง</span>
              <span :class="deliveryFee === 0 ? 'text-green-600 font-bold' : ''">
                {{ deliveryFee === 0 ? 'ฟรี' : '฿' + deliveryFee }}
              </span>
            </div>

          </div>

          <div class="border-t pt-4 flex justify-between text-lg font-bold">
            <span>ยอดรวมสุทธิ</span>
            <span class="text-orange-600">
              ฿{{ grandTotal.toLocaleString() }}
            </span>
          </div>

          <nuxt-link
            to="/checkout"
            class="block w-full mt-8 bg-black text-yellow-400 text-center py-4 rounded-full font-bold hover:bg-gray-800 transition"
          >
            ดำเนินการสั่งอาหาร
          </nuxt-link>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
export default {

  head() {
    return {
      title: 'ตะกร้าอาหาร | ร้านอาหารของเรา'
    }
  },

  computed: {

    cartItems() {
      return this.$store.state.cart.items
    },

    totalPrice() {
      return this.$store.getters['cart/totalPrice']
    },

    deliveryFee() {
      return this.totalPrice >= 300 ? 0 : 40
    },

    grandTotal() {
      return this.totalPrice + this.deliveryFee
    }

  },

  methods: {

    increaseQty(index) {
      this.cartItems[index].quantity++
    },

    decreaseQty(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--
      }
    },

    async removeItem(index) {
      const result = await this.$swal.fire({
        title: 'ลบเมนูนี้ออกจากตะกร้า?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก'
      })

      if (result.isConfirmed) {
        this.$store.dispatch('cart/removeItem', index)
      }
    }

  }
}
</script>
