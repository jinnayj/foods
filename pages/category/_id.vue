<template>
  <div class="container">
    <h1 class="title">เมนูเซ็ทอาหารของเรา</h1>

    <div v-if="loading" class="loading">กำลังโหลดเมนูแสนอร่อย...</div>

    <div v-else class="grid">
      <div v-for="item in foodSets" :key="item.id" class="card">
        <img :src="item.image_url" :alt="item.name" class="food-image" />
        <div class="card-content">
          <h3>{{ item.name }}</h3>
          <p>{{ item.description }}</p>
          <div class="price">{{ item.price }} บาท</div>
          <button class="btn-detail">ดูรายละเอียด</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js'

// กำหนดค่า Supabase (แนะนำให้ใส่ใน nuxt.config.js หรือ .env)
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

export default {
  data() {
    return {
      foodSets: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchFoodSets()
  },
  methods: {
    async fetchFoodSets() {
      try {
        this.loading = true
        const { data, error } = await supabase
          .from('food_sets') // ชื่อตารางใน Supabase
          .select('*')
        
        if (error) throw error
        this.foodSets = data
      } catch (err) {
        console.error('Error fetching data:', err.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.container { padding: 20px; max-width: 1200px; margin: auto; }
.title { text-align: center; margin-bottom: 30px; font-family: 'Kanit', sans-serif; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s;
  background: white;
}

.card:hover { transform: translateY(-5px); }

.food-image { width: 100%; height: 200px; object-fit: cover; }

.card-content { padding: 15px; }

.price {
  font-weight: bold;
  color: #e67e22;
  font-size: 1.2rem;
  margin: 10px 0;
}

.btn-detail {
  width: 100%;
  padding: 10px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>