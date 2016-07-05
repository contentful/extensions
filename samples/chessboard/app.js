var cfExtension = window.contentfulExtension || window.contentfulWidget
var ChessBoard = window.ChessBoard
var $ = window.$

cfExtension.init(function (api) {
  var board = ChessBoard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    onChange: function (old, current) {
      api.field.setValue(current)
    }
  })
  api.window.updateHeight()

  board.position(api.field.getValue())

  api.field.onValueChanged(function (p) {
    board.position(p)
  })

  $('button').on('click', function () {
    board.start()
  })
})
