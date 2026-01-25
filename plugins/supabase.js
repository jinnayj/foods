import { createClient } from '@supabase/supabase-js'
import fetch, { Headers, Request, Response } from 'cross-fetch'

// --- ไม้ตาย: บังคับประกาศตัวแปร Global ให้ Server รู้จัก ---
if (!global.Headers) {
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
  global.fetch = fetch
}
// -----------------------------------------------------

// ใส่ URL และ Key ของคุณตามเดิม
const supabaseUrl = 'https://grrcubjdzdyifdmkrmlv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycmN1YmpkemR5aWZkbWtybWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDg2MTMsImV4cCI6MjA4NDkyNDYxM30.MgjLEybnli23MeuUno0A3iNK-dIGqrzP89ekJOKLXcc'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

export default (_, inject) => {
  inject('supabase', supabase)
}