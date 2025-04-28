/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bodegadanes.s3.us-east-2.amazonaws.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },           // ✅ fix runtime error
    ],
  },
}

module.exports = nextConfig
