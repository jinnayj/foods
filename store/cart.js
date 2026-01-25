// store/cart.js

export const state = () => ({
  items: [] // เก็บรายการสินค้าในตะกร้า
})

export const getters = {
  // นับจำนวนสินค้าทั้งหมดในตะกร้า
  totalItems(state) {
    return state.items.length
  },
  // คำนวณราคารวม
  totalPrice(state) {
    return state.items.reduce((total, item) => total + item.price, 0)
  }
}

export const mutations = {
  // เพิ่มสินค้า
  ADD_ITEM(state, product) {
    state.items.push(product)
  },
  // ลบสินค้า
  REMOVE_ITEM(state, index) {
    state.items.splice(index, 1)
  },
  // ล้างตะกร้า
  CLEAR_CART(state) {
    state.items = []
  }
}