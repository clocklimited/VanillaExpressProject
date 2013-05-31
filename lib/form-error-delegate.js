var formErrorsTemplate = require('./views/form-errors.jade')
  , formErrorTemplate = require('./views/form-error.jade')

module.exports = function (wrapperClass) {

  function showErrors(errors) {
    this.clearErrors()
    var $errors = formErrorsTemplate({ errors: errors })
      , firstError = Object.keys(errors)[0]
    Object.keys(errors).forEach(function (key) {
      this.$(wrapperClass + ' [data-field=' + key + '] .js-error')
        .append(formErrorTemplate({ error: errors[key] }))
    })
    this.$(wrapperClass + ' .js-errors-summary').append($errors)
    // Set the focus to the first error
    this.$(':input[name=' + firstError + ']').focus()
  }

  function clearErrors() {
    this.$(wrapperClass + ' .js-errors-summary, ' + wrapperClass + ' .js-error').empty()
  }

  return {
    showErrors: showErrors,
    clearErrors: clearErrors
  }
}