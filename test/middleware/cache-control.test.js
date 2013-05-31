var request = require('supertest')
  , serviceLocator = require('service-locator').createServiceLocator()
  , noop = function () {}
serviceLocator.logger = { info: noop, warn: noop }
serviceLocator.properties = { env: 'development' }

var server = require('../../server')
  , app = server(serviceLocator, noop)

describe('cache-control middleware', function () {

  it('should add a short cache for most requests', function (done) {
    var r = request(app)
      .get('/')
      .expect(200)
      .end(function (error, res) {
        res.headers['cache-control'].should.equal('max-age=60')
        r.app.close()
        done()
      })
  })

  it('should not cache ?previewId ', function (done) {
    var r = request(app)
      .get('/?previewId=1')
      .expect(200)
      .end(function (error, res) {
        res.headers['cache-control'].should.equal('max-age=0')
        res.headers['pragma'].should.equal('no-cache')
        res.headers['expires'].should.equal('0')
        r.app.close()
        done()
      })
  })
})