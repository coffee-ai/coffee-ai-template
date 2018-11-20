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
const entry = require('../component.json')
const {version} = require('../package.json')


const webpackConfig = merge(baseWebpackConfig, {
  entry: entry,
  output: {
    path: config.component.assetsRoot,
    publicPath: config.component.assetsPublicPath,
    filename: '[name]/index.js',
    chunkFilename: '[name]/index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: util.styleLoaders({
      sourceMap: config.component.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  externals: util.getExternals(entry),
  mode: 'production',
  devtool: config.component.productionSourceMap ? config.component.devtool : false,
  optimization: {
    minimizer: [],
    mangleWasmImports: true,
    // runtimeChunk: false,
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '/',
      // minSize: 1000000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 1,
      name: true,
      cacheGroups: {
        vender: {
          name: 'vender',
          minSize: 0,
          chunks(chunk) {
            return chunk.name === 'index';
          },
          minChunks: 1,
          test: /node_modules\/(.*)\.js/,
          reuseExistingChunk: true
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'async',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssPlugin({
      filename: '[name].css',
      chunkFilename: '[name]/style.css'
    })
  ]
})

if (config.component.uglifyJSCSS) {
  const parser = require('postcss-safe-parser')
  const uglifyJs = new UglifyJsPlugin({
    uglifyOptions: {
      warning: false,
      mangle: true,
      output: {
        comments: false
      }
    },
    sourceMap: config.component.productionSourceMap,
    parallel: true
  });
  const uglifyCss = new OptimizeCssPlugin({
    cssProcessorOptions: config.component.productionSourceMap
      ? { parser: parser, map: { inline: false } }
      : { parser: parser }
  })
  webpackConfig.optimization.minimizer.push(uglifyJs)
  webpackConfig.optimization.minimizer.push(uglifyCss)
}

if (config.component.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig