/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xamgwfmeegluuhagkzen.supabase.co'],
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
