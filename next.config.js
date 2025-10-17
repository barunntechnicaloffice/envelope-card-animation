/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  ...(isProd && { output: 'export' }), // Static export only for production
  ...(isProd && { basePath: '/envelope-card-animation' }), // GitHub repo name only for production
  images: {
    unoptimized: true,
  },
  // Skip API routes for static export
  skipTrailingSlashRedirect: true,
  ...(isProd && { trailingSlash: true }), // Trailing slash only for production
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig