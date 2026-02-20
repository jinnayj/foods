<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
    <div class="container mx-auto px-4 py-12">

      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
          <p class="text-gray-500 text-sm">Control Panel for Super Admin</p>
        </div>

        <div class="bg-white p-1 rounded-lg shadow-sm border flex">
          <button v-for="tab in ['Orders', 'Products', 'Banners']" :key="tab" @click="activeTab = tab"
            :class="activeTab === tab ? 'bg-black text-white shadow' : 'text-gray-500 hover:bg-gray-100'"
            class="px-6 py-2 rounded-md text-sm font-bold transition duration-200">
            {{ tab }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-black"></div>
        <p class="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Data...</p>
      </div>

      <div v-else>
        <div v-if="activeTab === 'Orders'" class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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
    <td class="px-6 py-4 font-mono text-sm">#{{ order?.id }}</td>
    
    <td class="px-6 py-4">
      <p class="font-bold text-sm">{{ order?.customer_name || 'ไม่ระบุชื่อ' }}</p>
      <p class="text-xs text-gray-400">{{ order?.phone || '-' }}</p>
    </td>
    
    <td class="px-6 py-4 font-bold">฿{{ Number(order?.total_amount || 0).toLocaleString() }}</td>
    
    <td class="px-6 py-4">
      <span :class="getStatusColor(order?.status)"
        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
        {{ order?.status || 'pending' }}
      </span>
    </td>
    
    <td class="px-6 py-4 text-center">
      <button v-if="order?.status === 'paid'" @click="updateOrderStatus(order.id, 'shipped')"
        class="bg-black text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-gray-800 transition">
        Ship It 🚚
      </button>
      <button v-else-if="order?.status === 'pending' || !order?.status" @click="updateOrderStatus(order.id, 'paid')"
        class="bg-orange-500 text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-orange-600 transition">
        Confirm Paid 💰
      </button>
      <span v-else-if="order?.status === 'shipped'"
        class="text-xs text-green-600 font-bold flex items-center justify-center gap-1">
        Done ✅
      </span>
    </td>
  </tr>
</tbody>
    </table>
    
    <div v-if="orders.length === 0" class="p-12 text-center text-gray-400 font-bold">
      <p>ไม่มีรายการคำสั่งซื้อในขณะนี้</p>
    </div>
  </div>
</div>

        <div v-else-if="activeTab === 'Products'">
          <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
            <h3 class="font-bold text-lg mb-4">Add New Product</h3>
            <form @submit.prevent="addProduct" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label for="p_name" class="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                <input id="p_name" v-model="newProduct.name" required placeholder="Enter name"
                  class="border p-3 rounded focus:outline-none focus:border-black">
              </div>
              <div class="flex flex-col gap-1">
                <label for="p_price" class="text-xs font-bold text-gray-400 uppercase">Price (THB)</label>
                <input id="p_price" v-model="newProduct.price" required type="number" placeholder="0.00"
                  class="border p-3 rounded focus:outline-none focus:border-black">
              </div>
              <div class="flex flex-col gap-1">
                <label for="p_cat" class="text-xs font-bold text-gray-400 uppercase">Category</label>
                <select id="p_cat" v-model="newProduct.category" required
                  class="border p-3 rounded focus:outline-none focus:border-black">
                  <option disabled value="">Select Category</option>
                  <option>อาหารจานเดียว</option>
                  <option>กับข้าว</option>
                  <option>เซ็ทอาหาร</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label for="p_img" class="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                <input id="p_img" v-model="newProduct.imageUrl" required type="text" placeholder="https://..."
                  class="border p-3 rounded focus:outline-none focus:border-black text-sm">
              </div>

              <button type="submit" :disabled="btnLoading"
                class="col-span-1 md:col-span-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-bold shadow-md transition disabled:bg-gray-400 mt-2">
                {{ btnLoading ? 'Saving...' : '+ Add Product' }}
              </button>
            </form>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="product in products" :key="product.id"
              class="bg-white p-4 rounded-xl shadow-sm border group relative hover:shadow-md transition">
              <img :src="product.image_url" class="w-full h-40 object-cover rounded-md mb-2 bg-gray-100" alt="product image">
              <h4 class="font-bold text-sm truncate">{{ product.name }}</h4>
              <p class="text-gray-500 text-xs">฿{{ Number(product.price || 0).toLocaleString() }}</p>
              <button @click="deleteItem('products', product.id)"
                class="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:bg-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'Banners'">
          <div class="bg-white p-6 rounded-xl shadow-sm border mb-8">
            <h3 class="font-bold text-lg mb-4">Add Homepage Banner</h3>
            <form @submit.prevent="addBanner" class="flex flex-col gap-4">
              <div class="flex flex-col gap-1">
                <label for="b_title" class="text-xs font-bold text-gray-400 uppercase">Banner Title</label>
                <input id="b_title" v-model="newBanner.title" placeholder="Optional title"
                  class="border p-3 rounded focus:outline-none focus:border-black">
              </div>
              <div class="flex flex-col gap-1">
                <label for="b_img" class="text-xs font-bold text-gray-400 uppercase">Banner Image URL</label>
                <input id="b_img" v-model="newBanner.imageUrl" required type="text" placeholder="https://..."
                  class="border p-3 rounded focus:outline-none focus:border-black text-sm">
              </div>
              <button type="submit" :disabled="btnLoading"
                class="bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-bold shadow-md transition disabled:bg-gray-400">
                {{ btnLoading ? 'Saving...' : '+ Add Banner' }}
              </button>
            </form>
          </div>

          <div class="space-y-4">
            <div v-for="banner in banners" :key="banner.id" class="relative group">
              <img :src="banner.image_url" class="w-full h-48 object-cover rounded-xl shadow-sm border bg-gray-100" alt="banner">
              <div class="absolute bottom-4 left-4 bg-white px-3 py-1 rounded text-xs font-bold shadow">{{ banner.title || 'No Title' }}</div>
              <button @click="deleteItem('banners', banner.id)"
                class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition shadow-lg">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  // ✅ 1. Middleware ที่เสถียรกว่าเดิม
  async middleware({ $supabase, redirect }) {
    try {
      const { data: { session } } = await $supabase.auth.getSession()
      const ADMIN_EMAIL = 'admin@gmail.com' 
      if (!session || session.user.email !== ADMIN_EMAIL) {
        return redirect('/login')
      }
    } catch (e) {
      return redirect('/login')
    }
  },

  data() {
    return {
      activeTab: 'Orders',
      loading: true,
      btnLoading: false,
      orders: [],
      products: [],
      banners: [],
      newProduct: { name: '', price: '', category: '', imageUrl: '' },
      newBanner: { title: '', imageUrl: '' }
    }
  },

  // ✅ 2. Mounted Hook สำหรับ Client-side Data Fetching
  async mounted() {
    await this.refreshAllData()
  },

  methods: {
    async refreshAllData() {
      this.loading = true
      try {
        await Promise.all([
          this.fetchOrders(),
          this.fetchProducts(),
          this.fetchBanners()
        ])
      } catch (err) {
        console.error("Fetch Error:", err)
      } finally {
        this.loading = false
      }
    },

   async fetchOrders() {
  this.loading = true
  try {
    // ลองเปลี่ยนเป็นชื่อตารางตามที่คุณเห็นใน Supabase เป๊ะๆ
    const { data, error } = await this.$supabase
      .from('orders') // ถ้าใน DB เป็นตัวใหญ่ ให้แก้เป็น 'Orders'
      .select('*')
    
    if (error) {
      console.error("Supabase Error:", error.message) // ดู Error ตรงนี้
      return
    }

    console.log("Check Data:", data) // <--- สำคัญมาก! ดูใน Console (F12) ว่ามันขึ้น Array [] หรือเปล่า
    this.orders = data || []
  } catch (err) {
    console.error("Fetch Error:", err)
  } finally {
    this.loading = false
  }
},

    async fetchProducts() {
      const { data, error } = await this.$supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      this.products = data || []
    },

    async fetchBanners() {
      const { data, error } = await this.$supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false })
      this.banners = data || []
    },

    async addProduct() {
      this.btnLoading = true
      try {
        const { error } = await this.$supabase.from('products').insert({
          name: this.newProduct.name,
          price: Number(this.newProduct.price),
          category: this.newProduct.category,
          image_url: this.newProduct.imageUrl
        })
        if (error) throw error
        this.$swal.fire('Success', 'Product added!', 'success')
        this.newProduct = { name: '', price: '', category: '', imageUrl: '' }
        await this.fetchProducts()
      } catch (err) {
        this.$swal.fire('Error', err.message, 'error')
      } finally {
        this.btnLoading = false
      }
    },

    async addBanner() {
      this.btnLoading = true
      try {
        const { error } = await this.$supabase.from('banners').insert({
          title: this.newBanner.title,
          image_url: this.newBanner.imageUrl
        })
        if (error) throw error
        this.$swal.fire('Success', 'Banner added!', 'success')
        this.newBanner = { title: '', imageUrl: '' }
        await this.fetchBanners()
      } catch (err) {
        this.$swal.fire('Error', err.message, 'error')
      } finally {
        this.btnLoading = false
      }
    },

    async updateOrderStatus(id, status) {
      const { isConfirmed } = await this.$swal.fire({
        title: 'Update Status?',
        text: `Change order to ${status}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#000',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update'
      })

      if (isConfirmed) {
        const { error } = await this.$supabase.from('orders').update({ status }).eq('id', id)
        if (!error) {
          await this.fetchOrders()
          this.$swal.fire('Updated!', `Order status: ${status}`, 'success')
        }
      }
    },

    async deleteItem(table, id) {
      const { isConfirmed } = await this.$swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#ccc',
        confirmButtonText: 'Yes, delete it!'
      })

      if (isConfirmed) {
        const { error } = await this.$supabase.from(table).delete().eq('id', id)
        if (!error) {
          this.$swal.fire('Deleted!', 'Record has been removed.', 'success')
          table === 'products' ? await this.fetchProducts() : await this.fetchBanners()
        }
      }
    },

    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleString('th-TH', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
      })
    },

    getStatusColor(status) {
  // เพิ่มการเช็คเพื่อกัน Error reading status ในฟังก์ชันนี้ด้วย
  if (!status) return 'bg-gray-100 text-gray-400'; 
  
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-800'
    case 'shipped': return 'bg-blue-100 text-blue-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-500'
  }
}
  }
}
</script>