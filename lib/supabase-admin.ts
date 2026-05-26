import { createClient } from "@supabase/supabase-js"

console.log(
  "SUPABASE URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
)

console.log(
  "SERVICE ROLE EXISTS:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
)

console.log(
  "SERVICE ROLE PREFIX:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20)
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)