var jade = require('jade')
  , fs = require('fs')
  , versionator = require('versionator')
  , mappedVersion = versionator.createMapped(require('../static-file-map.json'))
  , _ = require('lodash')

module.exports = function renderJade(file) {

  var options = { compileDebug: true, filename: file }
    , template = fs.readFileSync(file)
    , fn = jade.compile(template, options)

  return function (locals) {
    return fn(_.extend({}, locals, { versionPath: mappedVersion.versionPath }))
  }
}