<template>
  <div class="font-sans text-gray-900 flex flex-col min-h-screen bg-gray-50/50">
    
    <nav class="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        
        <div class="flex items-center gap-10">
          <nuxt-link to="/" class="text-2xl font-black tracking-tighter uppercase flex items-center gap-2 text-orange-600">
            MoonLight <span class="text-[10px] bg-orange-600 text-white px-2 py-1 rounded-full not-italic tracking-normal">KITCHEN</span>
          </nuxt-link>
          
          <div class="hidden lg:flex space-x-8 text-xs font-black uppercase tracking-widest text-gray-400">
            <nuxt-link to="/" class="hover:text-orange-600 transition">หน้าแรก</nuxt-link>
            <nuxt-link to="/category/Main" class="hover:text-orange-600 transition">อาหารจานหลัก</nuxt-link>
            <nuxt-link to="/category/Snacks" class="hover:text-orange-600 transition">ทานเล่น</nuxt-link>
            <nuxt-link to="/category/Drinks" class="hover:text-orange-600 transition">เซ็ทอาหาร</nuxt-link>
          </div>
        </div>

        <div class="flex items-center gap-5">
          
          <div v-if="user" class="relative z-50">
            <button 
              @click="isMenuOpen = !isMenuOpen" 
              class="flex items-center gap-3 text-sm font-bold hover:bg-gray-100 p-1.5 pr-3 rounded-full transition focus:outline-none"
            >
              <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black">
                {{ user.email[0].toUpperCase() }}
              </div>
              <span class="hidden md:block text-xs uppercase tracking-tight">{{ user.email.split('@')[0] }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div v-if="isMenuOpen" @click="isMenuOpen = false" class="fixed inset-0 z-40 bg-transparent"></div>

            <div 
              v-show="isMenuOpen" 
              class="absolute right-0 top-full mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in-down"
            >
              <div class="px-5 py-3 border-b border-gray-50 mb-2">
                <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">สถานะผู้ใช้งาน</p>
                <p class="text-sm font-bold truncate text-orange-600">{{ user.email }}</p>
              </div>

              <nuxt-link 
                v-if="user.email === 'admin@gmail.com'"
                to="/admin"
                @click.native="isMenuOpen = false"
                class="block px-5 py-2.5 text-sm text-white font-bold bg-orange-500 hover:bg-orange-600 transition flex items-center gap-2 mx-2 rounded-xl mb-2"
              >
                🍳 ระบบจัดการร้านอาหาร
              </nuxt-link>

              <nuxt-link to="/orders" @click.native="isMenuOpen = false" class="block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                📦 ประวัติการสั่งซื้อ
              </nuxt-link>
              
              <button @click="handleLogout" class="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2 font-bold mt-2 border-t border-gray-50">
                🚪 ออกจากระบบ
              </button>
            </div>
          </div>

          <nuxt-link v-else to="/login" class="text-xs font-black bg-black text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition shadow-lg uppercase tracking-widest">
            Login
          </nuxt-link>

          <nuxt-link to="/cart" class="relative bg-white p-2.5 rounded-full border border-gray-100 hover:shadow-md transition group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 group-hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span 
              v-if="$store.getters['cart/totalItems'] > 0" 
              class="absolute -top-1 -right-1 bg-orange-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
            >
              {{ $store.getters['cart/totalItems'] }}
            </span>
          </nuxt-link>

        </div>
      </div>
    </nav>

    <div class="flex-grow">
      <Nuxt />
    </div>

    <footer class="bg-white text-gray-900 pt-20 pb-10 border-t border-gray-100">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="md:col-span-2">
            <h2 class="text-3xl font-black tracking-tighter uppercase mb-6 text-orange-600">DELISH KITCHEN</h2>
            <p class="text-gray-400 max-w-sm leading-relaxed text-sm">
              เสิร์ฟความอร่อยจากครัวถึงหน้าบ้านคุณ ด้วยวัตถุดิบคุณภาพพรีเมียมและความใส่ใจในทุกจาน
            </p>
            <div class="flex gap-4 mt-6">
              <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
              <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
              <div class="w-8 h-8 bg-gray-100 rounded-full"></div>
            </div>
          </div>
          
          <div>
            <h4 class="font-black uppercase mb-6 text-gray-900 text-xs tracking-widest">เมนูของเรา</h4>
            <ul class="space-y-4 text-gray-500 text-sm font-medium">
              <li><nuxt-link to="/category/Main" class="hover:text-orange-600 transition">อาหารจานหลัก</nuxt-link></li>
              <li><nuxt-link to="/category/Snacks" class="hover:text-orange-600 transition">ของทานเล่น</nuxt-link></li>
              <li><nuxt-link to="/category/Drinks" class="hover:text-orange-600 transition">เซ็ทอาหาร</nuxt-link></li>
            </ul>
          </div>

          <div>
            <h4 class="font-black uppercase mb-6 text-gray-900 text-xs tracking-widest">ช่วยเหลือ</h4>
            <ul class="space-y-4 text-gray-500 text-sm font-medium">
              <li><nuxt-link to="/orders" class="hover:text-orange-600 transition">ติดตามสถานะอาหาร</nuxt-link></li>
              <li><a href="#" class="hover:text-orange-600 transition">คำถามที่พบบ่อย</a></li>
              <li><a href="#" class="hover:text-orange-600 transition">ติดต่อเรา</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
          <p>&copy; 2026 DELISH KITCHEN. ALL RIGHTS RESERVED.</p>
          <div class="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      isMenuOpen: false
    }
  },
  async mounted() {
    const { data: { session } } = await this.$supabase.auth.getSession()
    this.user = session?.user || null

    if (this.user) {
      this.$store.dispatch('cart/fetchCart')
    }

    this.$supabase.auth.onAuthStateChange((_, session) => {
      this.user = session?.user || null
      if (this.user) {
        this.$store.dispatch('cart/fetchCart')
      } else {
        this.$store.commit('cart/CLEAR_CART')
      }
    })
  },
  methods: {
    async handleLogout() {
      this.isMenuOpen = false
      await this.$supabase.auth.signOut()
      this.$swal.fire({
        icon: 'success',
        title: 'ออกจากระบบสำเร็จ',
        text: 'ขอให้มีความสุขกับมื้ออาหารของคุณ!',
        showConfirmButton: false,
        timer: 1500,
        customClass: { popup: 'rounded-3xl' }
      })
      this.user = null
      this.$router.push('/')
    }
  }
}
</script>

<style>
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}
/* ปรับแต่ง Scrollbar ให้ดูสะอาดตา */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #000000; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #ff0000; }
</style>