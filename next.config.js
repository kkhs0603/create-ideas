const path = require("path");
const dotenv = require("dotenv-webpack");
module.exports = {
  distDir: "/.next",
  images: {
    domains: ["storage.googleapis.com"],
  },
  trailingSlash: true,
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,
      // Read the .env file
      new dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true,
      }),
    ];
    return config;
  },
};
