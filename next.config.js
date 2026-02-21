/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.slack-edge.com',
      },
      {
        protocol: 'https',
        hostname: 'ca.slack-edge.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'img.evbuc.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.evbuc.com',
      },
    ],
  },
};

export default nextConfig;
