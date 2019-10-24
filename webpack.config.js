const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const plugins = [
  new MiniCssExtractPlugin({
    filename: "[hash].css",
    chunkFilename: "[id].css"
  }),
  new HtmlWebPackPlugin({
    template: "index.html",
    filename: path.resolve(__dirname, "index.html"),
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
  let target = "debug";
  let cssLoader = "style-loader";
  if (argv.mode === "production") {
    target = "release";
    cssLoader = MiniCssExtractPlugin.loader;
  }
  return {
    context: path.resolve(__dirname, "src"),
    resolve: {
      alias: {
        slides: path.resolve(__dirname, "slides")
      }
    },
    entry: path.resolve(__dirname, "src/index.js"),
    output: {
      filename: "[hash].bundle.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/rubyconf2019/dist/"
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|wasm32)/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: path.resolve(
            __dirname,
            `target/wasm32-unknown-emscripten/${target}/playground.js`
          ),
          use: ["uglify-loader", "script-loader"]
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
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]"
              }
            }
          ]
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
          test: /\.wasm$/,
          type: "javascript/auto",
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/"
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
