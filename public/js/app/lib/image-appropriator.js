module.exports = imageAppropriator

/*
 * Given `availableHeight` and `availableWidth`, return the image
 * from the `images` array that best fits the space.
 */
function imageAppropriator(options) {
  /* jshint maxcomplexity: 7 */

  if (!options.height) throw new Error('options.height is required')
  if (!options.width) throw new Error('options.width is required')
  if (!options.images) throw new Error('options.images is required')

  var availableWidth = options.width
    , availableHeight = options.height
    , images = options.images
    , chosen = { diff: Infinity, image: null }
    , candidate
    , isLandscape = availableWidth > availableHeight

  for (var i = 0; i < images.length; i++) {
    candidate =
      { diff: isLandscape
          ? availableHeight - images[i].height
          : availableWidth - images[i].width
      , image: images[i]
      }
    if (chosen.diff < 0) continue
    if (candidate.diff < chosen.diff) {
      chosen = candidate
      continue
    }
  }
  return chosen.image
}