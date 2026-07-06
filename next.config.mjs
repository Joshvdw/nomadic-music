/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // hero layers + bio portrait are served at q100; everything else at 75
    qualities: [75, 100],
  },
};

export default nextConfig;
