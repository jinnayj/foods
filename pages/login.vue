<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-black uppercase tracking-tighter">Welcome Back</h2>
        <p class="mt-2 text-sm text-gray-600">
          เข้าสู่ระบบเพื่อจัดการออเดอร์ของคุณ
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="sr-only">Email address</label>
            <input v-model="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Email address">
          </div>
          <div>
            <label class="sr-only">Password</label>
            <input v-model="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="Password">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition transform active:scale-95">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </div>
        
        <div class="text-center text-sm">
          <span class="text-gray-500">ยังไม่มีบัญชี? </span>
          <nuxt-link to="/register" class="font-bold text-black hover:underline">สมัครสมาชิก</nuxt-link>
        </div>
      </form>
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
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 1500
        })
        
        this.$router.push('/')

      } catch (error) {
        this.$swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>