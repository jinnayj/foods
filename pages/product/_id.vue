<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
    <div class="container mx-auto px-4 py-10">

      <nuxt-link to="/" class="inline-flex items-center text-gray-500 hover:text-black mb-6">
        ← กลับไปหน้าเมนู
      </nuxt-link>

      <div v-if="!product" class="text-center py-20 text-red-500">
        ไม่พบข้อมูลเมนู
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-12">

        <!-- IMAGE -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg">
          <img
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- DETAILS -->
        <div>

          <p class="text-sm text-orange-500 font-bold mb-2">
            {{ product.category }}
          </p>

          <h1 class="text-4xl font-black mb-4">
            {{ product.name }}
          </h1>

          <p class="text-2xl font-bold text-orange-600 mb-6">
            ฿{{ product.price.toLocaleString() }}
          </p>

          <p class="text-gray-600 mb-8 leading-relaxed">
            {{ product.description || 'เมนูยอดนิยม รสชาติจัดจ้าน วัตถุดิบสดใหม่ทุกวัน 🍳' }}
          </p>

          <!-- ระดับความเผ็ด -->
          <div class="mb-6">
            <h3 class="font-bold mb-3">เลือกระดับความเผ็ด</h3>

            <div class="flex gap-3">
              <button
                v-for="level in spicyLevels"
                :key="level"
                @click="selectedSpicy = level"
                :class="[
                  'px-4 py-2 rounded-full border transition text-sm font-bold',
                  selectedSpicy === level
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white hover:border-orange-400'
                ]"
              >
                {{ level }}
              </button>
            </div>
          </div>

          <!-- Add-on -->
          <div class="mb-6">
            <h3 class="font-bold mb-3">เพิ่มเติม</h3>

            <div class="space-y-2">
              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="addons.cheese">
                เพิ่มชีส (+20฿)
              </label>

              <label class="flex items-center gap-2">
                <input type="checkbox" v-model="addons.egg">
                เพิ่มไข่ (+15฿)
              </label>
            </div>
          </div>

          <!-- จำนวน -->
          <div class="mb-8">
            <h3 class="font-bold mb-3">จำนวน</h3>

            <div class="flex items-center gap-4">
              <button @click="decreaseQty"
                      class="w-10 h-10 bg-gray-200 rounded-full font-bold">
                -
              </button>

              <span class="text-xl font-bold">
                {{ quantity }}
              </span>

              <button @click="increaseQty"
                      class="w-10 h-10 bg-orange-500 text-white rounded-full font-bold">
                +
              </button>
            </div>
          </div>

          <!-- ปุ่มสั่ง -->
          <button
            @click="addToCart"
            class="w-full bg-black text-yellow-400 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition shadow-lg"
          >
            เพิ่มลงตะกร้า 🍽️
          </button>

        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {

  async asyncData({ params, $supabase, error }) {
    try {
      const { data, error: dbError } = await $supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single()

      if (dbError) throw dbError

      return { product: data }

    } catch (e) {
      error({ statusCode: 404, message: 'Menu not found' })
    }
  },

  data() {
    return {
      quantity: 1,
      selectedSpicy: 'ปกติ',
      spicyLevels: ['ไม่เผ็ด', 'ปกติ', 'เผ็ด', 'เผ็ดมาก'],
      addons: {
        cheese: false,
        egg: false
      }
    }
  },

  methods: {

    increaseQty() {
      this.quantity++
    },

    decreaseQty() {
      if (this.quantity > 1) this.quantity--
    },

    addToCart() {

      let extraPrice = 0

      if (this.addons.cheese) extraPrice += 20
      if (this.addons.egg) extraPrice += 15

      const finalItem = {
        ...this.product,
        quantity: this.quantity,
        spicy_level: this.selectedSpicy,
        addons: this.addons,
        price: this.product.price + extraPrice
      }

      this.$store.dispatch('cart/addItem', finalItem)

      this.$swal.fire({
        icon: 'success',
        title: 'เพิ่มเมนูแล้ว 🍜',
        text: `${this.product.name} x${this.quantity}`,
        showConfirmButton: false,
        timer: 1500
      })
    }

  }

}
</script>
