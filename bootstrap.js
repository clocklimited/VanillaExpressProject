module.exports = bootstrap

var server = require('./server')
  , routes = require('./routes')

function bootstrap(serviceLocator, cb) {

  // Only start server if services have been initialized
  server(serviceLocator, routes)
  cb(null, serviceLocator)

}
