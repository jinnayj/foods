<template>
  <div class="font-sans text-gray-900 flex flex-col min-h-screen">
    
    <nav class="border-b bg-white sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <div class="flex items-center gap-8">
          <nuxt-link to="/" class="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
            CATWALK <span class="text-xs bg-black text-white px-2 py-1 rounded-sm not-italic tracking-normal">TH</span>
          </nuxt-link>
          
          <div class="hidden md:flex space-x-6 text-sm font-bold uppercase tracking-wide text-gray-500">
            <nuxt-link to="/" class="hover:text-black transition">New Arrivals</nuxt-link>
            <nuxt-link to="/category/Men" class="hover:text-black transition">Men</nuxt-link>
            <nuxt-link to="/category/Women" class="hover:text-black transition">Women</nuxt-link>
          </div>
        </div>

        <div class="flex items-center gap-6">
          
          <div v-if="user" class="relative z-50">
            <button 
              @click="isMenuOpen = !isMenuOpen" 
              class="flex items-center gap-2 text-sm font-bold hover:text-gray-600 transition focus:outline-none py-2"
            >
              <span 
                v-if="user.email === 'admin@gmail.com'" 
                class="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
              >
                Admin
              </span>
              <span class="hidden md:block">{{ user.email.split('@')[0] }}</span>
              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4 text-gray-400 transition transform"
                :class="{ 'rotate-180': isMenuOpen }"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div 
              v-if="isMenuOpen" 
              @click="isMenuOpen = false"
              class="fixed inset-0 z-40 bg-transparent cursor-default"
            ></div>

            <div 
              v-show="isMenuOpen" 
              class="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in-down"
            >
              <div class="px-4 py-3 border-b border-gray-50 mb-2">
                <p class="text-xs text-gray-400 uppercase font-bold">Signed in as</p>
                <p class="text-sm font-bold truncate">{{ user.email }}</p>
              </div>

              <nuxt-link 
                v-if="user.email === 'admin@gmail.com'"
                to="/admin"
                @click.native="isMenuOpen = false"
                class="block px-4 py-2 text-sm text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 transition flex items-center gap-2 mb-1"
              >
                ⚡ Admin Dashboard
              </nuxt-link>

              <nuxt-link 
                to="/orders" 
                @click.native="isMenuOpen = false"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition flex items-center gap-2"
              >
                📦 My Orders
              </nuxt-link>
              
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition flex items-center gap-2">
                ❤️ Wishlist
              </a>

              <div class="border-t border-gray-50 mt-2 pt-2">
                <button 
                  @click="handleLogout" 
                  class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2 font-bold"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          <nuxt-link v-else to="/login" class="text-sm font-bold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition shadow-md">
            Login
          </nuxt-link>

          <nuxt-link to="/cart" class="relative hover:text-gray-500 flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span 
              v-if="$store.getters['cart/totalItems'] > 0" 
              class="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
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

    <footer class="bg-black text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div class="md:col-span-2">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase mb-4">CATWALK</h2>
          <p class="text-gray-400 max-w-sm leading-relaxed text-sm">
            The destination for limited sneakers and streetwear. Authentic products only.
          </p>
        </div>
        <div>
          <h4 class="font-bold uppercase mb-6 text-gray-200 text-sm tracking-widest">Shop</h4>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li><nuxt-link to="/" class="hover:text-white transition">New Arrivals</nuxt-link></li>
            <li><nuxt-link to="/category/Men" class="hover:text-white transition">Men</nuxt-link></li>
            <li><nuxt-link to="/category/Women" class="hover:text-white transition">Women</nuxt-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold uppercase mb-6 text-gray-200 text-sm tracking-widest">Contact</h4>
          <ul class="space-y-3 text-gray-400 text-sm">
            <li>Bangkok, Thailand</li>
            <li>support@catwalk.com</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs uppercase tracking-wider">
        &copy; 2026 CATWALK. All rights reserved.
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
    // 1. เช็ค User ปัจจุบัน
    const { data: { session } } = await this.$supabase.auth.getSession()
    this.user = session?.user || null

    // 2. ถ้าล็อกอินแล้ว ให้โหลดตะกร้า
    if (this.user) {
      this.$store.dispatch('cart/fetchCart')
    }

    // 3. ดักฟังการ Login/Logout
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
      // ปิดเมนูก่อน
      this.isMenuOpen = false
      
      await this.$supabase.auth.signOut()
      this.$swal.fire({
        icon: 'success',
        title: 'Logged Out',
        showConfirmButton: false,
        timer: 1000
      })
      this.user = null
      this.$router.push('/')
    }
  }
}
</script>

<style>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fadeInDown 0.2s ease-out;
}
</style>