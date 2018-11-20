const MiniCssPlugin = require('mini-css-extract-plugin')
const {dependencies} = require('../package.json')

exports.getExternals = (entry) => {
  const externals = {};
  Object.keys(entry).forEach(key => {
  });
  Object.keys(dependencies).forEach(key => {
    externals[key] = key;
  });
  return externals;
}

exports.getBundleCacheGroup = function(bundle) {
  const cacheGroups = {};
  const chunkNames = Object.keys(bundle);
  const chunkNameSet = new Set(chunkNames);

  chunkNames.forEach(name => {
    cacheGroups[name] = {
      name,
      chunks: 'initial',
      minSize: 0,
      minChunks: 1,
      reuseExistingChunk: true,
      priority: 10000,
      enforce: true,
      test(module, chunks) {
        if (module.depth === 0) return false;
        const validChunks = chunks.filter(chunk => chunkNameSet.has(chunk.name));
        if (!validChunks.length) return false;
        const validChunkSet = new Set(validChunks.map(chunk => chunk.name));
        const chunkName = chunkNames.find(name => validChunkSet.has(name));
        return chunkName === name;
      }
    }
  });
  return cacheGroups;
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssPlugin.loader].concat(loaders)
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}