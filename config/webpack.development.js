const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");

module.exports = () => ({
  devtool: false,
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  devServer: {
    open: true,
    static: path.resolve(__dirname, "../dist"),
    port: 4200,
    compress: false
  },
  plugins: [new HotModuleReplacementPlugin()],
});
