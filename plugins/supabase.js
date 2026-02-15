import { createClient } from '@supabase/supabase-js'
import fetch, { Headers, Request, Response } from 'cross-fetch'

// fix SSR
if (!global.Headers) {
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
  global.fetch = fetch
}

// 🔥 ใช้ ENV แทน hardcode
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

export default (_, inject) => {
  inject('supabase', supabase)
}
