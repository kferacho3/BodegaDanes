/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },
  images: {
    domains: ["bodegadanes.s3.us-east-2.amazonaws.com"],
  },
};

module.exports = nextConfig;
