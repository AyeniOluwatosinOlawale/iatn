/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/sitemap', destination: '/site-map' },
    ]
  },
}

export default nextConfig
