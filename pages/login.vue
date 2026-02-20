<template>
  <div class="min-h-screen flex items-center justify-center bg-[#fdfaf7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-4xl w-full flex overflow-hidden bg-white rounded-2xl shadow-2xl">

      <div class="hidden md:block w-1/2 bg-cover bg-center relative"
        style="background-image: url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80')">
        <div
          class="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2px] flex flex-col justify-end p-10 text-white">
          <h1 class="text-4xl font-serif font-bold italic">Taste of Perfection.</h1>
          <p class="mt-2 text-gray-200">สัมผัสประสบการณ์รสชาติที่เหนือระดับได้ทุกวัน</p>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-10 lg:p-14">
        <div class="text-center md:text-left">
          <div class="flex justify-center md:justify-start mb-4">
            <span class="p-3 bg-orange-100 rounded-full text-orange-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </span>
          </div>
          <h2 class="text-3xl font-bold text-gray-800 tracking-tight">ยินดีต้อนรับกลับมา</h2>
          <p class="mt-2 text-sm text-gray-500 font-medium">เข้าสู่ระบบเพื่อจัดการออเดอร์สุดพิเศษของคุณ</p>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
  <div>
    <label class="block cursor-pointer">
      <span class="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">อีเมล</span>
      <input 
        v-model="email" 
        type="email" 
        required
        class="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700"
        placeholder="name@example.com">
    </label>
  </div>

  <div>
    <label class="block cursor-pointer">
      <span class="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">รหัสผ่าน</span>
      <input 
        v-model="password" 
        type="password" 
        required
        class="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700"
        placeholder="••••••••">
    </label>
  </div>


          <div class="flex items-center justify-end">
            <a href="#" class="text-xs font-semibold text-orange-600 hover:text-orange-700">ลืมรหัสผ่าน?</a>
          </div>

          <button type="submit" :disabled="loading"
            class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transform transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              กำลังดำเนินการ...
            </span>
            <span v-else>เข้าสู่ระบบ</span>
          </button>

          <div class="relative py-4">
            <div class="absolute inset-0 flex items-center px-1">
              <div class="w-full border-t border-gray-100"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase"><span
                class="bg-white px-2 text-gray-400 font-medium">หรือ</span></div>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              ยังไม่มีบัญชีสมาชิกใช่หรือไม่?
              <nuxt-link to="/register" class="font-bold text-orange-600 hover:underline">สมัครสมาชิกใหม่</nuxt-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      try {
        const { data, error } = await this.$supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) throw error

        this.$swal.fire({
          icon: 'success',
          title: 'ยินดีต้อนรับ',
          text: 'เข้าสู่ระบบสำเร็จแล้ว',
          showConfirmButton: false,
          timer: 1500,
          customClass: { popup: 'rounded-2xl' }
        })

        this.$router.push('/')

      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: error.message,
          customClass: { popup: 'rounded-2xl' }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>