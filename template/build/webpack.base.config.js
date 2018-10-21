'use strict'
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const vueLoader = require('vue-loader/lib/plugin');
const MiniCssPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('packages')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('packages'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      }
    ]
  },
  plugins: [
    new vueLoader()
  ]
}