var express = require('express')
  , versionator = require('versionator')
  , _ = require('lodash')
  , mappedVersion = versionator.createMapped(require(__dirname + '/static-file-map.json'))

module.exports = function (serviceLocator, routes) {

  var app = express()
    , gracefullyExiting = false
    // One month static file expire on non-development
    , staticContentExpiry =
      serviceLocator.properties.env === 'development' ? 0 : 2592000000

  // App and router might not always be the same thing as app
  serviceLocator
    .register('app', app)
    .register('router', app)

  // Return 502 while the server is shutting down
  app.use(function (req, res, next) {
    if (!gracefullyExiting) {
      return next()
    }
    res.set('Connection', 'close')
    res.send(502, 'Server is in the process of restarting.')
  })

  // Taken from: http://blog.argteam.com/
  process.on('SIGTERM', function () {
    gracefullyExiting = true
    serviceLocator.logger.warn('Received kill signal (SIGTERM), shutting down')

    setTimeout(function () {
      serviceLocator.logger.error('Could not close connections in time, forcefully shutting down')
      process.exit(1)
    }, 30000)

    serviceLocator.server.close(function () {
      serviceLocator.logger.info('Closed out remaining connections.')
      process.exit()
    })
  })

  app.set('view engine', 'jade')
  app.set('views', __dirname + '/views/templates')

  // Wire up the express logger to the app logger
  app.use(express.logger(
    { format: 'dev'
    , stream:
      { write: function (data) {
          serviceLocator.logger.info((data + '').trim())
        }
      }
    }))

  function compressFilter(req, res) {
    return (/svg|json|text|javascript/).test(res.getHeader('Content-Type'))
  }

  app
    .use(express.responseTime())
    .use(mappedVersion.middleware)
    // Gzip Compression for static assets
    .use('/static', express.compress({ filter: compressFilter }))
    .use('/static', express.static(__dirname + '/public',
      { maxAge: staticContentExpiry }))


    .use(function (req, res, next) {
      // Don't cache article and section previews
      if (req.query.previewId) {
        res.set(
          { 'Cache-Control': 'max-age=0'
          , 'Pragma': 'no-cache'
          , 'Expires': 0
          })
      } else {
        // Set a little bit of cache to stop reduce load
        res.set(
          { 'Cache-Control': 'max-age=60'
          })
      }
      next()
    })

    // Make versionPath available in the jade templates
    .use(function (req, res, next) {
      res.locals.versionPath = mappedVersion.versionPath
      next()
    })

  // Redirect urls with a trailing slash
  app.use(function (req, res, next) {
    if (/\w+\/$/.test(req.url)) {
      res.redirect(req.url.substr(0, req.url.length - 1))
    } else {
      next()
    }
  })

  routes(serviceLocator)

  /* jshint unused: false */
  app.use(function (req, res, next) {
    res.status(404)
    res.render('error/404')
  })

  app.use(function errorHandler(error, req, res, next) {
    serviceLocator.logger.error('Error occurred while handling request:\n',
      _.pick(req, 'method', 'url', 'query', 'headers', 'ip', 'ips'))
    serviceLocator.logger.error(error.message)
    serviceLocator.logger.error(error.stack)
    var status = error.status || 500
    res.status(status)
    res.render('error/' + status)
  })

  return app
}
