var fs = require('fs')
  , properties = require('../properties')()

module.exports = function (pliers) {

  pliers('setup', function (done) {
    var json = JSON.stringify(properties, null, 2)
    fs.writeFileSync(__dirname + '/../properties.json', json)
    done()
  })
}