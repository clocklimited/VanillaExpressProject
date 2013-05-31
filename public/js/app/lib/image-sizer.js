module.exports = imageSizer

/*
 * Given `availableHeight` and `availableWidth`, determine
 * the size the the image should be to best fit the space
 * while maintaining its aspect ratio.
 */
function imageSizer(options) {

  if (!options.height) throw new Error('options.height is required')
  if (!options.width) throw new Error('options.width is required')
  if (!options.image) throw new Error('options.image is required')

  var availableWidth = options.width
    , availableHeight = options.height
    , image = options.image
    , availableRatio = availableWidth / availableHeight
    , imageRatio = options.image.width / options.image.height
    , scale

  if (image.width <= availableWidth && image.height <= availableHeight) {
    // Short circuit if image is smaller than available space
    return { height: image.height, width: image.width }
  }

  if (imageRatio >= availableRatio) {

    // Image is more landscape than available space, shrink it horizontally
    scale = availableWidth / image.width
    return { height: scale * image.height, width: scale * image.width }

  } else {

    // Image is less landscape than available space, shrink it vertically
    scale = availableHeight / image.height
    return { height: scale * image.height, width: scale * image.width }

  }

}