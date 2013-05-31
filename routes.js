var indexView = require('./views/index')

module.exports = function (serviceLocator) {

  var showStaticPages =
    serviceLocator.properties.env === 'development' ||
    serviceLocator.properties.env === 'testing'

  if (showStaticPages) {
    serviceLocator.router.get('/static/home', function (req, res) {
      res.render('static/index')
    })
  }

  // For testing the error pages
  serviceLocator.router.get('/error/500', function (req, res, next) {
    next(new Error('Broken'))
  })

  // Basic homepage for starting out
  serviceLocator.router.get('/', function (req, res, next) {
    indexView(serviceLocator, req, function (error, content) {
      if (error) return next(error)
      res.send(content)
    })
  })

}
