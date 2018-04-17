Chessboard
==========

![Chessboard Widget in action](http://contentful.github.io/extensions/assets/chessboard.gif)

This extension uses [chessboard.js][] to display a chessboard that edits a JSON
field containing the position of the pieces.

In the directory containing this README, run the following commands.

To use the extension from your local environment:
* Fill in your space id in the `Makefile`.
* Run `make create` to upload your extension to the server
* Run `make build serve` to serve the extension
* Setup your content type an open the entry editor.

To use the chessboard extension in the Contentful App you need to create a content
type with a `JSON Object` field. In the field settings’ `Appearance` tab you
then need to select the `Chessboard` extension.

[chessboard.js]: http://chessboardjs.com/
[getting-token]: https://www.contentful.com/developers/docs/references/authentication/#getting-an-oauth-token
