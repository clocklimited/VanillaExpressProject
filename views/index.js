module.exports = render

var renderJade = require('../lib/render-jade')
  , template = renderJade(__dirname + '/templates/landing.jade')
  , async = require('async')
  , _ = require('lodash')

function render(serviceLocator, req, cb) {
  try {
    var html = template(
      { properties: serviceLocator.properties
      , content: ''
      })
    cb(null, html)
  } catch (e) {
    cb(e)
  }
}