const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const svgToMiniDataURI = require("mini-svg-data-uri");

const webpack = require("webpack");

const plugins = [
  new webpack.ProvidePlugin({
    Reveal: "reveal.js",
    hljs: "highlight.js/lib/highlight",
  }),
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].[contenthash].css",
  }),
  new HtmlWebPackPlugin({
    template: "index.html",
    filename: "index.html",
    chunks: ["landing"],
  }),
  new HtmlWebPackPlugin({
    template: "2019/index.html",
    filename: "2019/index.html",
    chunks: ["deck.2019"],
  }),
];

module.exports = (_env, argv) => {
  let cssLoader = "style-loader";
  let optimization = {
    minimize: false,
    chunkIds: "deterministic",
    moduleIds: "deterministic",
  };
  let publicPath = "/";
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
    optimization.minimize = true;
    optimization.minimizer = ["...", new CssMinimizerPlugin()];
    publicPath = "/rubyconf/";
  }
  return {
    context: path.resolve(__dirname, "src"),
    entry: {
      landing: path.resolve(__dirname, "src/landing.js"),
      "deck.2019": path.resolve(__dirname, "src/2019/deck.js"),
    },
    output: {
      filename: "[name].[contenthash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath,
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [cssLoader, "css-loader", "sass-loader"],
        },
        {
          test: /\.svg$/,
          include: [
            path.resolve(__dirname, "node_modules", "@artichokeruby/logo/img"),
            path.resolve(
              __dirname,
              "node_modules",
              "@artichokeruby/logo/favicons"
            ),
          ],
          type: "asset/resource",
          use: "@hyperbola/svgo-loader",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          include: [
            path.resolve(__dirname, "node_modules", "@artichokeruby/logo/img"),
            path.resolve(
              __dirname,
              "node_modules",
              "@artichokeruby/logo/favicons"
            ),
          ],
          exclude: /\.svg$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.svg$/,
          exclude: [
            path.resolve(__dirname, "node_modules", "@artichokeruby/logo/img"),
            path.resolve(
              __dirname,
              "node_modules",
              "@artichokeruby/logo/favicons"
            ),
          ],
          type: "asset",
          use: "@hyperbola/svgo-loader",
          generator: {
            dataUrl: (content) => {
              content = content.toString();
              return svgToMiniDataURI(content);
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          include: path.resolve(
            __dirname,
            "node_modules",
            "@artichokeruby/logo/optimized"
          ),
          type: "asset",
        },
        {
          test: /\.html$/,
          include: path.resolve(__dirname, "src", "partials"),
          use: "html-loader",
        },
        {
          test: /\.md$/,
          type: "asset/source",
        },
        {
          test: /\.rb$/,
          type: "asset/source",
        },
        {
          test: /\.txt$/,
          type: "asset/resource",
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: "asset/resource",
          generator: {
            filename: "font/[contenthash].[name][ext]",
          },
        },
      ],
    },
    plugins,
    optimization,
    devServer: {
      compress: true,
      host: "127.0.0.1",
      port: 9000,
    },
  };
};
