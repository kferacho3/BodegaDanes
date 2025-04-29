// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXTAUTH_URL:    process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bodegadanes.s3.us-east-2.amazonaws.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },
    ],
  },
}
