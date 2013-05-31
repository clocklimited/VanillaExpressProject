require('./lib/vendor/animate')
require('./lib/vendor/zepto-fx')
require('./lib/vendor/jquery.imagesloaded')
require('./lib/vendor/jquery.cookie')
require('./lib/vendor/select2')
require('./lib/vendor/scrollup')
require('./lib/break')
require('./lib/vendor/jquery.isotope')
require('./lib/vendor/isotope-modifiers')
require('./lib/vendor/jquery-scrolltofixed')
require('./lib/vendor/jquery.scrollTo')


// var fastclick = require('fastclick')
// fastclick(document.body)

var lapStart = 650
  , deskStart = 1024
  , wideDeskStart = 1500

var lapEnd = deskStart - 1


var lapMq = '(min-width:' + lapStart + 'px) and (max-width: '+ lapEnd +'px)'
  , deskMq = '(min-width:' + deskStart + 'px)'
  , palmMq = '(max-width:' + lapStart + 'px)'
  , wideDeskMq = '(min-width:' + wideDeskStart + 'px)'

// Create breakpoints on the next tick so
// that modules can know which breakpoint
// the page was loaded in
setTimeout(function () {
  window.addBreakpoint('palm', palmMq)
  window.addBreakpoint('lap', lapMq)
  window.addBreakpoint('desk', deskMq)
  window.addBreakpoint('wideDesk', wideDeskMq)
}, 0)

if (!window.catfish) {
  // Create a global event emitter to be used across the site.
  var Emitter = require('events').EventEmitter

  window.catfish = {
    bus: new Emitter()
  }
}

require('./widgets')

// Select2 Temp
$('.select2').select2({ minimumResultsForSearch:9999 })

/* IE SVG Fix */
if (!window.Modernizr.svg) {
  $('img[src*=".svg"]').each(function(){
    var $el = $(this)
    $el.attr('src', $el.data('fallback'))
  })
}