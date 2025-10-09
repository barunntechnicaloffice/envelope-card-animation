/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/envelope-card-animation' : '',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig