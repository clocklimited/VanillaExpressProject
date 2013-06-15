var _ = require('lodash')
  , basePort = +(process.env.PORT || 5200)
  , properties =
    // This is the port of the site
    { port: basePort
    , url: 'http://localhost.SITENAME.com:' + basePort
    , projectName: 'SITENAME'
    , projectId: 'sitename'
    , domain: 'localhost'
    , analytics: 'UA-XXXXXXXX-XX'
    , formats:
      { date:
        { short: 'DD MMM \'YY'
        , long: 'dddd DD MMMM YYYY'
        }
      , dateTime:
        { short: 'HH:mm DD MMM \'YY'
        , long: 'dddd DD MMMM YYYY, HH:mm'
        , longTimeZone: 'HH:mm A [on] dddd D MMMM YYYY'
        , events: 'HH.mm A[,] DD MMM YYYY'
        }
      }
    }

var environmentProperties =
  { development: { }
  , testing:
    { url: 'http://testing.SITENAME.com'
    , domain: 'testing.SITENAME.com'
    , analytics: 'UA-XXXXXXXX-XX'
    }
  , staging:
    { url: 'http://staging.SITENAME.com'
    , domain: 'staging.SITENAME.com'
    , analytics: 'UA-XXXXXXXX-XX'
    }
  , production:
    { url: 'http://SITENAME.com'
    , domain: 'SITENAME.com'
    , analytics: 'UA-XXXXXXXX-XX'
    }
  }

module.exports = function getProperties (environment) {

  properties.env = environment = environment || process.env.NODE_ENV || 'development'

  if (environmentProperties[environment] === undefined) {
    throw new RangeError('No properties for environment \'' + environment + '\'')
  }
  return _.merge({}, properties, environmentProperties[environment])
}
