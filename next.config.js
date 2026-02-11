/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
      },
      {
        protocol: 'https',
        hostname: 'www.nytimes.com',
      },
      {
        protocol: 'https',
        hostname: 'media4.giphy.com',
      },
    ],
  },
};

module.exports = nextConfig;
