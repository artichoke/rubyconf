const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].css",
  }),
  new HtmlWebPackPlugin({
    template: "index.html",
    filename: "index.html",
    chunks: ["landing"],
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  }),
  new HtmlWebPackPlugin({
    template: "2019/index.html",
    filename: "2019/index.html",
    chunks: ["deck.2019"],
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      useShortDoctype: true,
    },
  }),
  new webpack.ProvidePlugin({
    Reveal: "reveal.js",
    hljs: "highlight.js/lib/highlight",
  }),
];

module.exports = (env, argv) => {
  let cssLoader = "style-loader";
  let publicPath = "/";
  if (argv.mode === "production") {
    cssLoader = MiniCssExtractPlugin.loader;
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
      filename: "[name].[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath,
    },
    plugins,
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
          test: new RegExp(path.resolve(__dirname, "assets")),
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          exclude: new RegExp(path.resolve(__dirname, "assets")),
          use: {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        },
        {
          test: /\.svg$/,
          use: ["file-loader", "svgo-loader"],
        },
        {
          test: /\.rb$/,
          use: "raw-loader",
        },
        {
          test: /\.md$/,
          use: "raw-loader",
        },
        {
          test: /\.txt$/,
          use: "file-loader",
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: "file-loader",
            options: {
              outputPath: "font/",
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
    },
  };
};
