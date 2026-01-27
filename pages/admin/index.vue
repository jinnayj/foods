<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
    <div class="container mx-auto px-4 py-12">
      
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
          <p class="text-gray-500 text-sm">Control Panel for Super Admin</p>
        </div>
        
        <div class="bg-white p-1 rounded-lg shadow-sm border flex">
          <button 
            v-for="tab in ['Orders', 'Products', 'Banners']" 
            :key="tab"
            @click="activeTab = tab"
            :class="activeTab === tab ? 'bg-black text-white shadow' : 'text-gray-500 hover:bg-gray-100'"
            class="px-6 py-2 rounded-md text-sm font-bold transition duration-200"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div v-if="$fetchState.pending" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
      </div>

      <div v-else-if="activeTab === 'Orders'" class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-100 border-b">
              <tr>
                <th class="px-6 py-4 text-xs font-black text-gray-500 uppercase">ID</th>
                <th class="px-6 py-4 text-xs font-black text-gray-500 uppercase">Customer</th>
                <th class="px-6 py-4 text-xs font-black text-gray-500 uppercase">Total</th>
                <th class="px-6 py-4 text-xs font-black text-gray-500 uppercase">Status</th>
                <th class="px-6 py-4 text-xs font-black text-gray-500 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-mono text-sm">#{{ order.id }}</td>
                <td class="px-6 py-4">
                  <p class="font-bold text-sm">{{ order.customer_name }}</p>
                  <p class="text-xs text-gray-400">{{ formatDate(order.created_at) }}</p>
                </td>
                <td class="px-6 py-4 font-bold">฿{{ order.total_price.toLocaleString() }}</td>
                <td class="px-6 py-4">
                  <span :class="getStatusColor(order.status)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button 
                    v-if="order.status === 'paid'" 
                    @click="updateOrderStatus(order.id, 'shipped')" 
                    class="bg-black text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
                  >
                    Ship It 🚚
                  </button>
                  <span v-else-if="order.status === 'shipped'" class="text-xs text-green-600 font-bold flex items-center justify-center gap-1">
                    Done ✅
                  </span>
                  <span v-else class="text-xs text-gray-400 italic">Waiting...</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="orders.length === 0" class="p-8 text-center text-gray-400">ไม่มีรายการคำสั่งซื้อ</div>
        </div>
      </div>

      <div v-else-if="activeTab === 'Products'">
        <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h3 class="font-bold text-lg mb-4">Add New Product</h3>
          <form @submit.prevent="addProduct" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="newProduct.name" required placeholder="Product Name" class="border p-3 rounded focus:outline-none focus:border-black">
            <input v-model="newProduct.price" required type="number" placeholder="Price (THB)" class="border p-3 rounded focus:outline-none focus:border-black">
            <select v-model="newProduct.category" required class="border p-3 rounded focus:outline-none focus:border-black">
              <option disabled value="">Select Category</option>
              <option>Men</option>
              <option>Women</option>
              <option>Accessories</option>
            </select>
            
            <input 
              v-model="newProduct.imageUrl" 
              required 
              type="text" 
              placeholder="Paste Image URL here (https://...)" 
              class="border p-3 rounded focus:outline-none focus:border-black text-sm"
            >
            
            <button type="submit" :disabled="loading" class="col-span-1 md:col-span-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-bold shadow-md transition">
              {{ loading ? 'Saving...' : '+ Add Product' }}
            </button>
          </form>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="product in products" :key="product.id" class="bg-white p-4 rounded-xl shadow-sm border group relative hover:shadow-md transition">
            <img :src="product.image_url" class="w-full h-40 object-cover rounded-md mb-2 bg-gray-100">
            <h4 class="font-bold text-sm truncate">{{ product.name }}</h4>
            <p class="text-gray-500 text-xs">฿{{ product.price.toLocaleString() }}</p>
            <button @click="deleteItem('products', product.id)" class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'Banners'">
        <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <h3 class="font-bold text-lg mb-4">Add Homepage Banner</h3>
          <form @submit.prevent="addBanner" class="flex flex-col gap-4">
            <input v-model="newBanner.title" placeholder="Banner Title (Optional)" class="border p-3 rounded focus:outline-none focus:border-black">
            
            <input 
              v-model="newBanner.imageUrl" 
              required 
              type="text" 
              placeholder="Paste Banner Image URL here (https://...)" 
              class="border p-3 rounded focus:outline-none focus:border-black text-sm"
            >
            
            <button type="submit" :disabled="loading" class="bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-bold shadow-md transition">
              {{ loading ? 'Saving...' : '+ Add Banner' }}
            </button>
          </form>
        </div>

        <div class="space-y-4">
          <div v-for="banner in banners" :key="banner.id" class="relative group">
            <img :src="banner.image_url" class="w-full h-48 object-cover rounded-xl shadow-sm border bg-gray-100">
            <div class="absolute bottom-4 left-4 bg-white px-3 py-1 rounded text-xs font-bold shadow">{{ banner.title || 'No Title' }}</div>
            <button @click="deleteItem('banners', banner.id)" class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  // Middleware ป้องกันคนอื่นเข้า
  async middleware({ redirect, $supabase }) {
    const { data: { user } } = await $supabase.auth.getUser()
    
    // 👇👇👇 แก้ตรงนี้ให้เป็นอีเมลของคุณ! 👇👇👇
    const ADMIN_EMAIL = 'admin@gmail.com' 

    if (!user || user.email !== ADMIN_EMAIL) {
       return redirect('/')
    }
  },

  data() {
    return {
      activeTab: 'Orders', // Tab เริ่มต้น
      loading: false,
      orders: [],
      products: [],
      banners: [],
      
      // Form Data (เปลี่ยนจาก imageFile เป็น imageUrl)
      newProduct: { name: '', price: '', category: '', imageUrl: '' },
      newBanner: { title: '', imageUrl: '' }
    }
  },

  async fetch() {
    await Promise.all([this.fetchOrders(), this.fetchProducts(), this.fetchBanners()])
  },

  methods: {
    // --- FETCH DATA ---
    async fetchOrders() {
      const { data } = await this.$supabase.from('orders').select('*').order('created_at', { ascending: false })
      this.orders = data || []
    },
    async fetchProducts() {
      const { data } = await this.$supabase.from('products').select('*').order('created_at', { ascending: false })
      this.products = data || []
    },
    async fetchBanners() {
      const { data } = await this.$supabase.from('banners').select('*').order('created_at', { ascending: false })
      this.banners = data || []
    },

    // --- ADD ACTIONS (ไม่ต้องอัปโหลดแล้ว ใช้ลิงก์ได้เลย) ---
    async addProduct() {
      this.loading = true
      try {
        // บันทึกข้อมูลลง Database เลย (ใช้ imageUrl ที่กรอกมา)
        const { error } = await this.$supabase.from('products').insert({
          name: this.newProduct.name,
          price: Number(this.newProduct.price),
          category: this.newProduct.category,
          image_url: this.newProduct.imageUrl // ใช้ลิงก์ตรงๆ
        })

        if (error) throw error

        this.$swal.fire('Success', 'Product added!', 'success')
        this.newProduct = { name: '', price: '', category: '', imageUrl: '' } // Reset Form
        this.fetchProducts() // Refresh List
      } catch (err) {
        this.$swal.fire('Error', err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    async addBanner() {
      this.loading = true
      try {
        const { error } = await this.$supabase.from('banners').insert({
          title: this.newBanner.title,
          image_url: this.newBanner.imageUrl // ใช้ลิงก์ตรงๆ
        })

        if (error) throw error

        this.$swal.fire('Success', 'Banner added!', 'success')
        this.newBanner = { title: '', imageUrl: '' }
        this.fetchBanners()
      } catch (err) {
        this.$swal.fire('Error', err.message, 'error')
      } finally {
        this.loading = false
      }
    },

    // --- DELETE / UPDATE ---
    async deleteItem(table, id) {
      const confirm = await this.$swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (confirm.isConfirmed) {
        const { error } = await this.$supabase.from(table).delete().eq('id', id)
        if (!error) {
          this.$swal.fire('Deleted!', 'Item has been deleted.', 'success')
          if (table === 'products') this.fetchProducts()
          if (table === 'banners') this.fetchBanners()
        }
      }
    },

    async updateOrderStatus(id, status) {
        // เพิ่มการยืนยันก่อนเปลี่ยนสถานะ
        const confirm = await this.$swal.fire({
            title: 'Confirm Shipment?',
            text: "Customer will be notified that the order is shipped.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#000',
            confirmButtonText: 'Yes, Ship it!'
        })

        if (confirm.isConfirmed) {
            await this.$supabase.from('orders').update({ status }).eq('id', id)
            this.fetchOrders()
            this.$swal.fire('Updated', `Status changed to ${status}`, 'success')
        }
    },

    // Utils
    formatDate(date) { return new Date(date).toLocaleDateString('th-TH') + ' ' + new Date(date).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'}) },
    
    getStatusColor(status) {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800'
        case 'shipped': return 'bg-blue-100 text-blue-800'
        case 'pending': return 'bg-yellow-100 text-yellow-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-500'
      }
    }
  }
}
</script>