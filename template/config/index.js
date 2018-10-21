'use strict'
const path = require('path')

module.exports = {
  dev: {
    assetsSubDirectory: 'libs',
    assetsPublicPath: '/',
    assetsRoot: path.resolve(__dirname, './libs'),
    cssSourceMap: true,
    host: '127.0.0.1',
    port: 8081,
    autoOpenBrowser: true,
    poll: false,
    proxyTable: {}
  },
  build: {
    assetsRoot: path.resolve(__dirname, '../libs'),
    assetsSubDirectory: '',
    assetsPublicPath: '',
    uglifyJSCSS: true,
    productionSourceMap: false,
    bundleAnalyzerReport: false,
  },
  component: {
    // Paths
    assetsRoot: path.resolve(__dirname, '../libs'),
    assetsSubDirectory: 'libs',
    assetsPublicPath: '/',
    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',
    uglifyJSCSS: true,
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: false
  }
}