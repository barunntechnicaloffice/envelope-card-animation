/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/envelope-card-animation',
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig