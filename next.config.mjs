/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c.tenor.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
