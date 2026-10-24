/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Beginner-friendly: a stray type/lint warning will not block your first deploy.
  // Set both to false once you are comfortable fixing them (run `npm run typecheck`).
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
};
export default nextConfig;
