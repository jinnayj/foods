export const state = () => ({
  items: []
})

export const getters = {
  totalItems: state =>
    state.items.reduce((total, item) =>
      total + (item.quantity || 1), 0),

  totalPrice: state =>
    state.items.reduce((total, item) =>
      total + (item.price * (item.quantity || 1)), 0)
}

export const mutations = {
  SET_ITEMS(state, items) {
    state.items = items
  },

  ADD_ITEM_LOCAL(state, item) {
    state.items.push(item)
  },

  UPDATE_QUANTITY_LOCAL(state, { index, quantity }) {
    state.items[index].quantity = quantity
  },

  REMOVE_ITEM_LOCAL(state, index) {
    state.items.splice(index, 1)
  },

  CLEAR_CART(state) {
    state.items = []
  }
}

export const actions = {

  // 🔹 1. โหลดตะกร้า
  async fetchCart({ commit }) {
    const { data: { user } } = await this.$supabase.auth.getUser()

    if (!user) return

    const { data, error } = await this.$supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id)

    if (error) {
      console.error('FETCH CART ERROR:', error)
      return
    }

    const formattedItems = data.map(item => ({
      cart_id: item.id,
      product_id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      image_url: item.products.image_url,
      category: item.products.category,
      quantity: item.quantity
    }))

    commit('SET_ITEMS', formattedItems)
  },

  // 🔹 2. เพิ่มสินค้า
  async addItem({ commit, state }, product) {
    const { data: { user } } = await this.$supabase.auth.getUser()

    // ✅ กรณี Guest
    if (!user) {
      const existingIndex = state.items.findIndex(
        item => item.product_id === product.id
      )

      if (existingIndex !== -1) {
        commit('UPDATE_QUANTITY_LOCAL', {
          index: existingIndex,
          quantity: state.items[existingIndex].quantity + 1
        })
      } else {
        commit('ADD_ITEM_LOCAL', {
          ...product,
          product_id: product.id,
          quantity: 1
        })
      }

      return
    }

    // ✅ กรณี User (เช็คว่ามีอยู่แล้วไหม)
    const { data: existing } = await this.$supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()

    if (existing) {
      // เพิ่มจำนวน
      const { error } = await this.$supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)

      if (error) {
        console.error('UPDATE QUANTITY ERROR:', error)
        throw error
      }

    } else {
      // เพิ่มรายการใหม่
      const { error } = await this.$supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        })

      if (error) {
        console.error('ADD CART ERROR:', error)
        throw error
      }
    }

    // โหลดใหม่เพื่อ sync กับ DB
    await this.dispatch('cart/fetchCart')
  },

  // 🔹 3. ลบสินค้า
  async removeItem({ commit, state, dispatch }, index) {
    const item = state.items[index]
    const { data: { user } } = await this.$supabase.auth.getUser()

    if (!user) {
      commit('REMOVE_ITEM_LOCAL', index)
      return
    }

    if (item.cart_id) {
      const { error } = await this.$supabase
        .from('cart_items')
        .delete()
        .eq('id', item.cart_id)

      if (error) {
        console.error('DELETE ERROR:', error)
        return
      }
    }

    dispatch('fetchCart')
  },

  // 🔹 4. ล้างตะกร้า
  async clearCart({ commit }) {
    const { data: { user } } = await this.$supabase.auth.getUser()

    if (user) {
      await this.$supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
    }

    commit('CLEAR_CART')
  }
}
