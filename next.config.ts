/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1) Skip ESLint errors during production build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2) Your image domains
  images: {
    domains: ["bodegadanes.s3.us-east-2.amazonaws.com"],
  },

  // If you need other flags, add them here…
};

module.exports = nextConfig;
