module.exports = function injectAd($el) {

  // Empty the provided element to clear any previously loaded ad
  $el.empty()

  // Create the script element
  var script = document.createElement('script')
  script.text = 'googletag.cmd.push(function() { googletag.display(\'' + $el.attr('id') + '\') })'

  // Add the ad container to provided element
  $el.append(script)
}