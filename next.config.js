require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL,
  },
}

console.log('POSTGRES_URL in next.config.js:', process.env.POSTGRES_URL);

module.exports = nextConfig