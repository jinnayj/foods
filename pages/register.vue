<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">

      <div class="text-center">
        <h2 class="text-3xl font-black uppercase tracking-tighter">
          สมัครสมาชิก
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          สมัครเพื่อสั่งอาหาร ติดตามสถานะ และรับโปรโมชั่นพิเศษ 🍳
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">

        <div class="space-y-4">

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">
              ชื่อ - นามสกุล
            </label>
            <input
              v-model="fullName"
              type="text"
              required
              class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="สมชาย ใจดี"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              required
              minlength="6"
              class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
            />
          </div>

        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 rounded-full font-bold text-white bg-black hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {{ loading ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิก' }}
          </button>
        </div>

        <div class="text-center text-sm">
          <span class="text-gray-500">มีบัญชีอยู่แล้ว? </span>
          <nuxt-link to="/login" class="font-bold text-black hover:underline">
            เข้าสู่ระบบ
          </nuxt-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false
    }
  },

  methods: {
    async handleRegister() {

      // 🔒 เช็ค password ตรงกัน
      if (this.password !== this.confirmPassword) {
        this.$swal.fire({
          icon: 'warning',
          title: 'รหัสผ่านไม่ตรงกัน',
          confirmButtonColor: '#000'
        })
        return
      }

      if (this.password.length < 6) {
        this.$swal.fire({
          icon: 'warning',
          title: 'รหัสผ่านสั้นเกินไป',
          text: 'กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร'
        })
        return
      }

      this.loading = true

      try {
        const { data, error } = await this.$supabase.auth.signUp({
          email: this.email.trim(),
          password: this.password,
          options: {
            data: {
              full_name: this.fullName
            }
          }
        })

        if (error) throw error

        // ถ้าเปิด Email Confirmation
        if (!data.session) {
          this.$swal.fire({
            icon: 'success',
            title: 'สมัครสำเร็จ 🎉',
            text: 'กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ',
            confirmButtonColor: '#000'
          })
        } else {
          this.$swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ',
            timer: 1500,
            showConfirmButton: false
          })
        }

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
