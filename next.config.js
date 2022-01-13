const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

const nextConfig = {
  webpack(config) {
    config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  images: {
    disableStaticImages: true
  }
};

module.exports = withPlugins([withImages()], nextConfig);
