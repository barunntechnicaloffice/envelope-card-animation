/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // output: 'export', // dev 서버에서는 주석 처리
  // basePath: isProd ? '/envelope-card-animation' : '', // dev에서 사용 안함
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig