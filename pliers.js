module.exports = tasks

var join = require('path').join
  , child
  , stylus = require('stylus')
  , nib = require('nib')
  , stylusRender = require('stylus-renderer')
  , browjadify = require('./pliers/lib/browjadify')
  , versionator = require('versionator')
  , browserify = require('browserify')
  , compressJs = require('./pliers/lib/compress-js')
  , fs = require('fs')
  , lrServer
  , debug = process.env.NODE_ENV === undefined

// Growl is only for Mac users
try {
  var growl = require('growl')
    , tinylr = require('tiny-lr')
} catch (e) {}

function notify() {
  if (growl) growl.apply(null, arguments)
}

function refresh(files){
  if (lrServer) {
    lrServer.changed({
      body: {
        files: files
      }
    })
  }
}

function tasks(pliers) {

  // include external tasks
  require('./pliers/setup')(pliers)

  function log(msg, level) {
    pliers.logger[level](msg)
  }

  pliers.logger.info(debug ? 'Debug mode' : 'Production mode')

  pliers.filesets('css', join(__dirname, 'public', '**/*.styl'))

  pliers.filesets('browserJs',
    [ join(__dirname, 'public', 'js', 'app', '**/*.js') ])

  pliers.filesets('templates', join(__dirname, 'public', 'js', 'app', '**/*.jade'))

  pliers.filesets('tests', [join(__dirname, 'bundles', '*', '**/*.test.js'),
    join(__dirname, 'test', '*', '**/*.test.js')])

  pliers.filesets('serverJs',
    [ join(__dirname, 'lib/**/*.js')
    , join(__dirname, '*.js')
    , join(__dirname, '*.json')
    , join(__dirname, 'views/**/*.js')
    , join(__dirname, 'views/templates/**/*.jade')
    ]
  )

  pliers('renderCss', function (done) {

    function compile(str, path) {
      return stylus(str)
        .use(nib())
        .set('filename', path)
        .set('warn', false)
        .set('compress', true)
        .define('versionPath', function (urlPath) {
          return new stylus.nodes.Literal('url(' + mappedVersion.versionPath(urlPath.val) + ')')
        })
    }
    var mappedVersion = versionator.createMapped(require(__dirname + '/static-file-map.json'))
      , stylesheets =
      [ join(__dirname, 'public', 'css', 'index.styl')
      , join(__dirname, 'public', 'css', 'index-ie7.styl')
      , join(__dirname, 'public', 'css', 'index-ie8.styl')
      , join(__dirname, 'public', 'css', 'error.styl')
      ]

    stylusRender(stylesheets, { compress: !debug, compile: compile }, function (err) {
      if (err) pliers.logger.error(err.message)
      done()
    }).on('log', log)
  })

  pliers('clean', function (done) {
    pliers.rm(join(__dirname, 'public', 'js', 'build'))
    done()
  })

  pliers('buildBrowserJs', 'createStaticMap', function (done) {

    pliers.mkdirp(join(__dirname, 'public', 'js', 'build'))

    var script = 'global.js'
      , b = browserify(join(__dirname, 'public', 'js', 'app', script))

    b.transform(browjadify)

    b.bundle({ debug: debug }, function (err, js) {

      if (err) return done(err)

      if (!debug) {
        pliers.logger.info('Compressing Browser JavaScript', script)
        js = compressJs(js)
      }

      fs.writeFile(join(__dirname, 'public', 'js', 'build', script), js, 'utf-8', function (err) {
        if (err) return done(err)
        done()
      })

    })

  })


  pliers('build', 'setup', 'createStaticMap', 'renderCss', 'buildBrowserJs', 'createStaticMap', function (done) {
    done()
  })

  pliers('qa', 'test', 'lint', 'testFeatures')

  pliers('lint', function (done) {
    pliers.exec('./node_modules/jshint/bin/jshint .', done)
  })

  pliers('noExitLint', function (done) {
    var child = pliers.exec('./node_modules/jshint/bin/jshint .', false, done)
    child.on('exit', function (code) {
      if (code === 1) {
        notify('Lint errors found')
      }
    })
  })

  pliers('qaWatch', function () {
    pliers.logger.info('Watching for JavaScript changes for QA')
    pliers.run('noExitLint')
    pliers.watch(pliers.filesets.serverJs, function () {
      pliers.run('noExitLint')
    })
  })

  pliers('test', function (done) {
    pliers.exec('node ./test/tests', done)
  })

  pliers('testFeatures', function (done) {
    pliers.exec(
      [ './node_modules/cucumber/bin/cucumber.js'
      , '--require'
      , 'test/feature/cucumber/step_definitions/section-form.feature.js'
      , 'test/feature/cucumber/*'].join(' '), done)
  })

  pliers('start', function (done) {
    if (child) child.kill()
    child = pliers.exec('node app')
    done()
  })



  pliers('livereload', function(done) {
    if (tinylr) {
      var port = 35729
      if (lrServer === undefined) {
        lrServer = new tinylr()
        lrServer.listen(port, function() {
          pliers.logger.info('LiveReload listening on', port)
        })
      }
    } else {
      pliers.logger.info('LiveReload Not Available')
    }
    done()
  })

  pliers('createStaticMap', function (done) {
    var versionator = require('versionator')
    versionator.createMapFromPath(__dirname + '/public', function(error, staticFileMap) {
      var prefixMap = {}
      for(var key in staticFileMap) {
        prefixMap['/static' + key] = '/static' + staticFileMap[key]
      }
      fs.writeFileSync(__dirname + '/static-file-map.json', JSON.stringify(prefixMap, null, true))
      done()
    })
  })

  pliers('watch', function (done) {

    pliers.run('livereload')

    pliers.logger.info('Watching for application JavaScript changes')
    pliers.watch(pliers.filesets.serverJs, function () {
      pliers.run('start', function () {
        pliers.logger.info('Restarting server…')
        notify('Server restarted')
      })
    })

    pliers.logger.info('Watching for CSS changes')
    pliers.watch(pliers.filesets.css, function () {
      pliers.run('renderCss', function () {
        notify('CSS rendered')
        refresh('css/index.css')
      })
    })

    pliers.logger.info('Watching for browser JavaScript changes')
    pliers.watch(pliers.filesets.browserJs.concat(pliers.filesets.templates), function () {
      pliers.run('buildBrowserJs', function () {
        notify('JS and templates built')
      })
    })
    done()

  })

  pliers('go', 'build', function () {
    pliers.runAll('watch', function () {
      pliers.run('start')
    })
  })

}