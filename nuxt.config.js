export default {
  // Global page headers
  head: {
    title: 'catwalk-v2',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Plugins
  plugins: [
    '~/plugins/supabase.js'
  ],

  // Global CSS
  css: [
  ],

  // Auto import components
  components: true,

  // Modules for dev and build
  buildModules: [
    '@nuxtjs/tailwindcss',
  ],

  // Modules
  modules: [
    '@nuxtjs/axios',
  ],

  // Axios module configuration
  axios: {
    baseURL: '/',
  },

  // --- แก้ไขตรงนี้ (Build Configuration) ---
  build: {
    // 1. สั่งให้ Nuxt แปลงโค้ดภาษาใหม่ๆ ของ Supabase ให้อ่านออก
    transpile: [
      '@supabase/supabase-js',
      '@supabase/gotrue-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js',
      '@supabase/storage-js',
      '@supabase/functions-js',
      'iceberg-js' // ตัวนี้ที่ error ล่าสุด
    ],

    // 2. ตั้งค่า Webpack ให้รู้จักไฟล์นามสกุล .mjs
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
    }
  }
}