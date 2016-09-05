Chessboard
==========

![Chessboard Widget in action](http://contentful.github.io/extensions/assets/chessboard.gif)

This extension uses [chessboard.js][] to display a chessboard that edits a JSON
field containing the position of the pieces.

In the directory containing this README, run the following commands.

~~~bash
make create CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=my-cf-token SPACE=my-space-id
make build serve
~~~

The Contentful documentation shows you how to [obtain an a
token][getting-token].

To use the chessboard extension in the Contentful App you need to create a content
type with a “JSON Object” field. In the field settings’ “Appearance” tab you
then need to select the “Chessboard” extension.


[chessboard.js]: http://chessboardjs.com/
[getting-token]: https://www.contentful.com/developers/docs/references/authentication/#getting-an-oauth-token
