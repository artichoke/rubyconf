const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const svgToMiniDataURI = require("mini-svg-data-uri");

const webpack = require("webpack");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
    chunkFilename: "[id].css",
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
  new webpack.ProvidePlugin({
    Reveal: "reveal.js",
    hljs: "highlight.js/lib/highlight",
  }),
];

module.exports = (_env, argv) => {
  let cssLoader = "style-loader";
  let optimization = {
    minimize: false,
  };
  let publicPath = "/";
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
    optimization.minimize = true;
    optimization.minimizer = [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ];
    publicPath = "/rubyconf/";
  }
  return {
    context: path.resolve(__dirname, "src"),
    resolve: {
      alias: {
        assets: path.resolve(__dirname, "assets"),
        slides: path.resolve(__dirname, "slides"),
      },
    },
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
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: [cssLoader, "css-loader"],
        },
        {
          test: /\.svg$/,
          include: new RegExp(path.resolve(__dirname, "assets")),
          type: "asset/resource",
          use: "svgo-loader",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          include: new RegExp(path.resolve(__dirname, "assets")),
          exclude: /\.svg$/,
          type: "asset/resource",
          use: "image-webpack-loader",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          exclude: new RegExp(path.resolve(__dirname, "assets")),
          type: "asset",
          use: "image-webpack-loader",
        },
        {
          test: /\.svg$/,
          exclude: new RegExp(path.resolve(__dirname, "assets")),
          type: "asset/inline",
          use: "svgo-loader",
          generator: {
            dataUrl: (content) => {
              content = content.toString();
              return svgToMiniDataURI(content);
            },
          },
        },
        {
          test: /\.rb$/,
          type: "asset/source",
        },
        {
          test: /\.md$/,
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
            filename: "fonts/[contenthash].[name][ext]",
          },
        },
      ],
    },
    plugins,
    optimization,
  };
};
