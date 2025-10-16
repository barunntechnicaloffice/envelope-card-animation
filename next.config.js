/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export', // Static export for GitHub Pages
  basePath: isProd ? '/envelope-card-animation' : '', // GitHub repo name
  images: {
    unoptimized: true,
  },
  // Skip API routes for static export
  skipTrailingSlashRedirect: true,
  trailingSlash: true,
  webpack: (config) => {
    return config
  }
}

module.exports = nextConfig