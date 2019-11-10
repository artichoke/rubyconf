const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css",
    chunkFilename: "[id].css"
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
      useShortDoctype: true
    }
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
      useShortDoctype: true
    }
  }),
  new HtmlWebpackInlineSourcePlugin(),
  new webpack.ProvidePlugin({
    Reveal: "reveal.js",
    hljs: "highlight.js/lib/highlight"
  })
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
        slides: path.resolve(__dirname, "slides")
      }
    },
    entry: {
      landing: path.resolve(__dirname, "src/landing.js"),
      "deck.2019": path.resolve(__dirname, "src/2019/deck.js")
    },
    output: {
      filename: "[name].[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          use: [cssLoader, "css-loader"]
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: ["url-loader", "image-webpack-loader"]
        },
        {
          test: /\.svg/,
          use: ["svg-url-loader"]
        },
        {
          test: /\.rb$/,
          use: ["raw-loader"]
        },
        {
          test: /\.md$/,
          use: ["raw-loader"]
        },
        {
          test: /\.txt$/,
          use: ["file-loader"]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "font/"
              }
            }
          ]
        }
      ]
    },
    plugins,
    optimization: {
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()]
    }
  };
};
