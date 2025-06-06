// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXTAUTH_URL:    process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ADMIN_EMAIL:     process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD:  process.env.ADMIN_PASSWORD,
    ADMIN_PASSKEY:   process.env.ADMIN_PASSKEY,
    DATABASE_URL:    process.env.DATABASE_URL,         // ← added
    SHADOW_DATABASE_URL: process.env.SHADOW_DATABASE_URL, // ← added
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bodegadanes.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
    ],
  },
};
