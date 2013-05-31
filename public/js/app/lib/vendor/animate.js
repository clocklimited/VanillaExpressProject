(function () {

// Mock necessary parts of zepto for fx module
window.Zepto = function () { return $(arguments) }
window.Zepto.isObject = function () { return false }
window.Zepto.each = $.each
window.Zepto.extend = $.extend
window.Zepto.fn = {}

/*
 * Animate with zepto if CSS transitions are
 * available, or jQuery if they are not.
 */
function getAnimateFn() {
  if (window.Modernizr.csstransitions) {
    return function (properties, duration, ease, callback) {
      var args = arguments
        , el = $(this)
      if (duration) duration = duration / 1000
      if (typeof ease === 'function') callback = ease, ease = null
      return window.Zepto.fn.anim.apply(el,
        [properties, duration, ease || 'ease-in-out', callback])
    }
  } else {
    return function (properties, duration, ease, callback) {
      $.fn.animate.apply($(this), arguments)
    }
  }
}

$.fn.transition = getAnimateFn()

}())