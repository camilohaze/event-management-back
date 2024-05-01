const path = require("path");

module.exports = {
  entry: "app.js",
  output: {
    path: path.join(__dirname, "/dist"),
    publicPath: "/dist",
    filename: "app.js",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        user: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
