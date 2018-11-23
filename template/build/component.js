'use strict'
require('./check-versions')()

const fs = require('fs')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.component.config.js')

const spinner = ora('building for components...')
spinner.start()

rm(path.join(config.component.assetsRoot, config.component.assetsSubDirectory), {
  rmdir: function(...args) {
    const [p, cb] = args
    if (p === path.join(config.component.assetsRoot, config.component.assetsSubDirectory)) {
      const files = fs.readdir(p, function(er, files) {
        if (er)
          return cb(er)
        const n = files.length
        files.forEach(function(file, index) {
          const curPath = path.join(p, file)
          fs.stat(curPath, function(error, info) {
            if (info.isDirectory()) {
              fs.rmdir(curPath, cb)
            } else {
              fs.unlink(curPath, cb)
            }
          })
        })
      });
      return cb.apply(null)
    }
    return fs.rmdir.apply(null, args)
  }
}, err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build Components failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build Components complete.\n'))
  })
})
