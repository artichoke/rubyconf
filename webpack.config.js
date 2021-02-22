const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const posthtml = require("posthtml");
const posthtmlInclude = require("posthtml-include");
const svgToMiniDataURI = require("mini-svg-data-uri");

const webpack = require("webpack");

const root = path.resolve(__dirname);

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
          include: path.resolve(__dirname, "src", "assets"),
          type: "asset/resource",
          use: "@hyperbola/svgo-loader",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          include: path.resolve(__dirname, "src", "assets"),
          exclude: /\.svg$/,
          type: "asset/resource",
          generator: {
            filename: "[name][ext]",
          },
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          exclude: path.resolve(__dirname, "src", "assets"),
          type: "asset",
        },
        {
          test: /\.svg$/,
          exclude: path.resolve(__dirname, "src", "assets"),
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
          test: /\.html$/,
          use: {
            loader: "html-loader",
            options: {
              sources: {
                list: [
                  "...",
                  {
                    tag: "iframe",
                    attribute: "src",
                    type: "src",
                  },
                ],
              },
              preprocessor: (content, loaderContext) => {
                let result;

                try {
                  result = posthtml()
                    .use(posthtmlInclude({ root }))
                    .process(content, { sync: true });
                } catch (error) {
                  loaderContext.emitError(error);
                  return content;
                }

                return result.html;
              },
            },
          },
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
