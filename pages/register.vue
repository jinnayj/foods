<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-black uppercase tracking-tighter">Join the Crew</h2>
        <p class="mt-2 text-sm text-gray-600">
          สมัครสมาชิกเพื่อรับสิทธิพิเศษและติดตามสถานะสินค้า
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input v-model="email" type="email" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="user@example.com">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input v-model="password" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="กำหนดรหัสผ่าน (อย่างน้อย 6 ตัว)">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
            <input v-model="confirmPassword" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm" placeholder="ยืนยันรหัสผ่านอีกครั้ง">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition transform active:scale-95 shadow-lg">
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>
        </div>
        
        <div class="text-center text-sm">
          <span class="text-gray-500">มีบัญชีอยู่แล้ว? </span>
          <nuxt-link to="/login" class="font-bold text-black hover:underline">เข้าสู่ระบบ</nuxt-link>
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
      confirmPassword: '', 
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      // 1. เช็คว่ารหัสผ่านตรงกันไหม
      if (this.password !== this.confirmPassword) {
        this.$swal.fire({
          icon: 'warning',
          title: 'รหัสผ่านไม่ตรงกัน',
          text: 'กรุณากรอกรหัสผ่านทั้ง 2 ช่องให้เหมือนกันครับ',
          confirmButtonColor: '#000000'
        })
        return
      }

      // 2. ถ้าตรงกันแล้ว ส่งไปสมัคร
      this.loading = true
      try {
        // สำคัญ: ใส่ .trim() เพื่อตัดช่องว่างหน้า-หลังอีเมลทิ้ง (แก้ปัญหา Email invalid)
        const { data, error } = await this.$supabase.auth.signUp({
          email: this.email.trim(), 
          password: this.password
        })

        if (error) throw error

        // 3. สมัครสำเร็จ
        this.$swal.fire({
          icon: 'success',
          title: 'Welcome!',
          text: 'สมัครสมาชิกสำเร็จแล้ว',
          showConfirmButton: false,
          timer: 1500
        })
        
        this.$router.push('/')

      } catch (error) {
        // 4. แจ้งเตือน Error
        this.$swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>