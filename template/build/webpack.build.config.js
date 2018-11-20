'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const util = require('./util')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin')
const entry = require('../build.json')
const {version} = require('../package.json')

const webpackConfig = merge(baseWebpackConfig, {
  entry: entry,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      ...util.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: false,
        usePostCSS: true
      }),
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
          publicPath: './libs'
        }
      }
    ]
  },
  externals: util.getExternals(entry),
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  optimization: {
    minimizer: [],
    mangleWasmImports: true,
    splitChunks: {
      maxInitialRequests: 1
    }
  },
  plugins: [
    new MiniCssPlugin({
      filename: '[name].css',
    })
  ]
})

const BannerPlugin = new webpack.BannerPlugin({
  banner: ''
});

webpackConfig.plugins.push(BannerPlugin)

if (config.build.uglifyJSCSS) {
  const parser = require('postcss-safe-parser')
  const uglifyJs = new UglifyJsPlugin({
    uglifyOptions: {
      warning: false,
      mangle: true,
      output: {
        comments: /Copyright/i
      }
    },
    extractComments: false,
    sourceMap: config.build.productionSourceMap,
    parallel: true
  });
  const uglifyCss = new OptimizeCssPlugin({
    cssProcessorOptions: config.build.productionSourceMap
      ? { parser: parser, map: { inline: false } }
      : { parser: parser }
  })
  webpackConfig.optimization.minimizer.push(uglifyJs)
  webpackConfig.optimization.minimizer.push(uglifyCss)
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig