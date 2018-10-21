'use strict'
const webpack = require('webpack')
const path = require('path')
const config = require('../config/index.js')
const util = require('./util')
const baseWebpackConfig = require('./webpack.base.config.js')
const copyWebpackPlugin = require('copy-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const friendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const merge = require('webpack-merge')
const portfinder = require('portfinder')
const os = require('os')

const network = os.networkInterfaces()
let host
Object.keys(network).forEach(a => {
  const obj = network[a];
  obj.forEach(b => {
    if (/ipv4/i.test(b.family) && !b.internal && !/127\.0\.0\.1/.test(b.address)) {
      host = b.address;
    }
  })
})
const devWebpackConfig = merge(baseWebpackConfig, {
  entry: { index: './packages/main.js' },
  output: {
    path: config.dev.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name]/index.js'
  },
  mode: 'development',
  module: {
    rules: [
      ...util.styleLoaders({
        sourceMap: config.dev.cssSourceMap,
        usePostCSS: true
      }),
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
      ]
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: host || process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true,
    watchOptions: {
      poll: config.dev.poll
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../libs'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(new friendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [
            `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
          ]
        }
      }))
      resolve(devWebpackConfig)
    }
  })
})