const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const path = require("path");

const destinationFolder = "../dist-extension";
const sourceFolder = "src/extension";

module.exports = () => {
  return {
    devtool: "cheap-module-source-map",
    entry: {
        content: path.resolve(`${sourceFolder}/content.tsx`),
        background: path.resolve(`${sourceFolder}/background.tsx`),
    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [MiniCssExtractPlugin.loader,  "css-loader", "scss-loader"],
          },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles/[name].[contenthash].css",
            chunkFilename: "[id].css",
        }),
        new CopyPlugin({
          patterns: [
            { from: path.resolve(`${sourceFolder}/manifest.json`), to: path.resolve(destinationFolder) }, 
            { from: path.resolve(`${sourceFolder}/index.html`), to: path.resolve(destinationFolder) }, 
            { from: path.resolve(`${sourceFolder}/assets`), to: path.resolve(`${destinationFolder}/images`) }, 
          ],
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), "..."],
        runtimeChunk: {
          name: "runtime",
        },
    },
    output: {
        filename: "[name].js",
        clean: true,
        path: path.resolve(__dirname, destinationFolder)
    }
}
};
