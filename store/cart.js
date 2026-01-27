export const state = () => ({
  items: []
})

export const getters = {
  totalItems: state => state.items.length,
  totalPrice: state => state.items.reduce((total, item) => total + item.price, 0)
}

export const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },
  ADD_ITEM_LOCAL(state, item) {
    state.items.push(item)
  },
  REMOVE_ITEM_LOCAL(state, index) {
    state.items.splice(index, 1)
  },
  CLEAR_CART(state) {
    state.items = []
  }
}

export const actions = {
  // 1. โหลดตะกร้า (Load Cart)
  async fetchCart({ commit }) {
    const { data: { user } } = await this.$supabase.auth.getUser()
    
    if (!user) {
      // ถ้าไม่ได้ล็อกอิน ไม่ต้องดึงจาก Database (ใช้ Local เดิม)
      return 
    }

    // ดึงข้อมูลจากตาราง cart_items
    const { data, error } = await this.$supabase
      .from('cart_items')
      .select('*, products(*)') 
    
    if (error) {
      console.error('Error fetching cart:', error)
      return
    }

    // จัด Format ให้ตรงกับหน้าเว็บ
    const formattedItems = data.map(item => ({
      cart_id: item.id,
      product_id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      image_url: item.products.image_url,
      size: item.size,
      category: item.products.category
    }))

    commit('SET_ITEMS', formattedItems)
  },

  // 2. เพิ่มสินค้า (Add Item)
  async addItem({ commit }, item) {
    const { data: { user } } = await this.$supabase.auth.getUser()

    // A. กรณี Guest (ยังไม่ล็อกอิน) -> เก็บในเครื่อง
    if (!user) {
      commit('ADD_ITEM_LOCAL', item)
      return
    }

    // B. กรณี User (ล็อกอินแล้ว) -> บันทึกลง Supabase
    const { data, error } = await this.$supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: item.id,
        size: item.size,
        quantity: 1
      })
      .select()

    if (error) {
      this.$swal.fire({ icon: 'error', title: 'Error', text: error.message })
      return
    }

    // อัปเดตหน้าเว็บทันที
    const newItem = { 
      ...item, 
      cart_id: data[0].id,
      product_id: item.id 
    }
    commit('ADD_ITEM_LOCAL', newItem)
  },

  // 3. ลบสินค้า (Remove Item)
  async removeItem({ commit, state }, index) {
    const item = state.items[index]
    const { data: { user } } = await this.$supabase.auth.getUser()

    // A. กรณี Guest
    if (!user) {
      commit('REMOVE_ITEM_LOCAL', index)
      return
    }

    // B. กรณี User -> ลบจาก Database
    if (item.cart_id) {
      const { error } = await this.$supabase
        .from('cart_items')
        .delete()
        .eq('id', item.cart_id)

      if (error) {
        console.error('Error deleting item:', error)
        return
      }
    }

    commit('REMOVE_ITEM_LOCAL', index)
  },

  // 4. ล้างตะกร้า (Clear Cart) - ใช้ตอนจ่ายเงินเสร็จ หรือ Logout
  async clearCart({ commit }) {
    const { data: { user } } = await this.$supabase.auth.getUser()

    // ถ้าเป็น User ล็อกอิน -> ต้องลบข้อมูลใน Database ด้วย
    if (user) {
      await this.$supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id) // ลบทุกรายการของ User คนนี้
    }

    // ล้างหน้าเว็บ
    commit('CLEAR_CART')
  }
}