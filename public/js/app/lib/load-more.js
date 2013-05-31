module.exports = LoadMore

var noop = function () { }

/*
 * Given `availableHeight` and `availableWidth`, determine
 * the size the the image should be to best fit the space
 * while maintaining its aspect ratio.
 */
function LoadMore(options) {

  if (!options.target) throw new Error('target is required')
  if (!options.element) throw new Error('element is required to render')

  var self = {}
    , page = options.page || 0

  /**
   *  This is called to retive the data for the next page
   *  `page` number - current page number
   *  `options` object
   *  `callback` function
   */
  self.more = function () {
    throw new Error('You need to implement this function.')
  }

  self.render = function (data) {
    options.element.parent().append($('p').html(JSON.stringify(data)))
  }

  self.onStart = noop
  self.onEnd = noop
  self.noop = noop
  self.target = options.target
  self.element = options.element
  self.next = function () {
    self.onStart()
    self.more(page++, options, function (data) {
      self.render(data)
      self.onEnd()
    })
  }

  options.target.on('click', function (e) {
    e.preventDefault()
    self.next()
  })

  return self

}