var UglifyJS = require('uglify-js')

module.exports = function compress(data, options) {

  /* jshint camelcase: false */

  var opts = options || {}
  , topLevel = UglifyJS.parse(data, opts.parse)
  , compressor = UglifyJS.Compressor(opts.compressor)

  topLevel.figure_out_scope()

  var compressed = topLevel.transform(compressor)

  compressed.figure_out_scope()
  compressed.compute_char_frequency()
  compressed.mangle_names()

  return compressed.print_to_string(options)
}