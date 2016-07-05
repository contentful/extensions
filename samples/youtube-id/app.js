/* global $ */
const cfExt = window.contentfulExtension || window.contentfulWidget

cfExt.init((api) => {
  const $code = $('code')

  api.field.onValueChanged(function (value) {
    $code.text(value || '')
  })

  $('button').on('click', function () {
    $code.text('')
    api.field.setValue(null)
  })

  $('input').on('input', function (ev) {
    const match = ev.target.value.match(/youtube\.com\/watch\?v=(\w+)/)

    if (match) {
      api.field.setValue(match[1])
      $code.text(match[1])
    }
  })
})
