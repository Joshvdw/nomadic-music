/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // hero layers + bio portrait are served at q90; everything else at 75
    qualities: [75, 90],
  },
};

export default nextConfig;
