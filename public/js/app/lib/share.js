module.exports =
{ parseFBTags: function () {
      try {
        FB.XFBML.parse()
      } catch (e) {}
    }
, parseTwitterTags: function () {
    try {
      twttr.widgets.load()
    } catch (e) {}
  }
, parseGooglePlusTags: function (url) {
    try {
      gapi.plusone.render(
          'js-plus-one-container'
          ,
            { href: url
            , size: 'medium'
            }
        )
    } catch (e) {}
  }
}