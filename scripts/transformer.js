// const transformer = require('react-native/packager/transformer');

let upstreamTransformer = null

try {
  // handle RN >= 0.47
  upstreamTransformer = require('metro-bundler/src/transformer')
} catch (e) {
  try {
    // handle RN 0.46
    upstreamTransformer = require('metro-bundler/build/transformer')
  } catch (e) {
    // handle RN <= 0.45
    const oldUpstreamTransformer = require('react-native/packager/transformer')
    upstreamTransformer = {
      transform({ src, filename, options }) {
        return oldUpstreamTransformer.transform(src, filename, options)
      },
    }
  }
}

module.exports.transform = function(src, filename, options) {
  if (typeof src === 'object') {
    // handle RN >= 0.46
    ;({ src, filename, options } = src)
  }

  if (/[\/\\]node_modules[\/\\](ammonext|lodash|three)[\/\\]/.test(filename)) {

    return {
      ast: null,
      code: src,
      filename,
      map: null 
    };
  } else {
    return upstreamTransformer.transform({ src, filename, options })
  }
}
