const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
  images: {
    disableStaticImages: true
  }
};

module.exports = withPlugins([withImages()], nextConfig);
