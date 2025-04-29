/** @type {import('next').NextConfig} */
module.exports = {
  eslint: { ignoreDuringBuilds: true },

  // Expose env for NextAuth at build & runtime
  env: {
    NEXTAUTH_URL:    process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    ADMIN_EMAIL:     process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD:  process.env.ADMIN_PASSWORD,
    ADMIN_PASSKEY:   process.env.ADMIN_PASSKEY,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bodegadanes.s3.us-east-2.amazonaws.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },
    ],
  },
};
