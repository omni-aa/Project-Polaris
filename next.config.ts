// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

// Check if we are in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Import the next-pwa plugin and initialize it
import withPWA from 'next-pwa';

const configWithPWA = withPWA({
    dest: 'public', // PWA files will be output to the 'public' directory
    disable: !isProduction, // Disable PWA in development
    register: true,
    skipWaiting: true,
})(nextConfig);

// Export the final configuration
export default configWithPWA;