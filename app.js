var serviceLocator = require('service-locator').createServiceLocator()
  , bootstrap = require('./bootstrap')
  , properties = require('./properties.json')
  , logger = require('logga')
  , clusterMaster = require('clustered')
  , cpus = require('os').cpus()
  , domain = require('domain')
  , http = require('http')
  , sigmund = require('sigmund')
  , uberCache = require('uber-cache')

serviceLocator
  .register('properties', properties)
  .register('logger', logger({ timeOnly: true, context: 'site' }))
  .register('cache', uberCache({ hasher: hasher }))

bootstrap(serviceLocator, function (error, serviceLocator) {

  if (error) throw error

  clusterMaster(function () {

    var serverDomain = domain.create()

    serverDomain.run(function () {

      var server = http.createServer(function (req, res) {

        var resd = domain.create()
        resd.add(req)
        resd.add(res)

        resd.on('error', function (error) {
          serviceLocator.logger.error('Error', error, req.url)
          resd.dispose()
        })

        return serviceLocator.app(req, res)
      }).listen(process.env.PORT || serviceLocator.properties.port, function () {
        serviceLocator.logger.info('Server running on address: '
          + server.address().address + ' port: ' + server.address().port
          + ' URL: ' + properties.url)
      })
      serviceLocator.register('server', server)
    })
  },
  { logger: serviceLocator.logger
  , size: properties.siteProcesses || Math.ceil(cpus.length * 0.7) // Site uses 70% of the system CPUs
  })
})

/*
 * Better hash function for uber-cache, as
 * the built in one won't hash objects.
 */
function hasher() {
  return sigmund(arguments, 10)
}