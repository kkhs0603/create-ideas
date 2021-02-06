const path = require("path");
const dotenv = require("dotenv-webpack");
require("dotenv").config();
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
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    });
    return config;
  },
};
