# Contentful extensions repository

This repository provides core field editors and samples of Contentful
extensions, developed using the [UI Extensions SDK](https://github.com/contentful/ui-extensions-sdk).

## Core field editors

We're progressively opening our [core field editors](./core-field-editors)
within this repository, allowing you to understand how each component works, and
create your own extensions based on them rather than starting from scratch.

## Extensions samples

Each example comes with a README file explaining how to build and use it.
They're showing various types of integrations with popular frameworks or build
systems like:
- npm
- Gulp
- Makefile
- Webpack
- Babel

Please remember that most of them require you to host their dependencies on your
 own server which supports CORS and is available in HTTPS in order to be used
outside your local environment.

#### [Basic Rating Dropdown](./samples/rating-dropdown)

![rating-dropdown](http://contentful.github.io/extensions/assets/rating-dropdown.png)

This example is a basic extension meant to help you *get started* with custom
extensions development. Uses a dropdown to change the value of a number field
and makes some CMA requests.

#### [Rich Text Editor](./samples/alloy-editor)

![alloy-editor](http://contentful.github.io/extensions/assets/alloy-editor.png)

This example integrates the [Alloy rich-text/HTML editor](http://alloyeditor.com/)
to edit “Text” fields. Great to personalize the entry editor and enable HTML
editing as an alternative to Markdown.

#### [Slug Generator](./samples/slug)

![slug-extension](http://contentful.github.io/extensions/assets/slug-widget.png)

This example will automatically generate its value from an entry's title field.
For example typing “Hello World” into the title field will set the extensions
input field to “hello-world”. It will also check the uniquness of the slug
across a customizable list of content types. It highlights how the extensions
SDK can be used to *inspect any value* of an entry and *react to changes*.

#### [JSON Editor](./samples/json-editor)

![json-editor-ok](http://contentful.github.io/extensions/assets/json-editor.png)

This example provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net)
library. It should be used with fields with the type “Object”.

#### [JSON Form Editor](./samples/json-form-editor)

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

This example integrates the [JSON Editor](https://github.com/jdorn/json-editor)
library to display an edit form based on a predefined [JSON Schema](https://json-schema.org/).
Form input gets stored as a JSON object.

#### [Translator](./samples/translate)

![translate-extension](http://contentful.github.io/extensions/assets/translate-widget.png)

This example translates text from the default locale to other locales in a space
using the Yandex translation API.

#### [Wistia Videos](./samples/wistia)

![Screenshot of Wistia extension](http://contentful.github.io/extensions/assets/wistia.gif)

This example loads videos from a [project](http://wistia.com/doc/projects) on
[wistia](http://wistia.com/) into the Contentful Web Application. A video can be
easily previewed, selected and then stored as part of your content. In this
example extension we store the video embed URL in Contentful so the video can be
embedded easily.

#### [YouTube ID](./samples/youtube-id)

![youtube-id](http://contentful.github.io/extensions/assets/youtube-id.png)

This example extracts the video id from a valid YouTube URI. Useful as a simple
way to integrate with 3rd party media services.

#### [Diffing Published and Draft](./samples/diff)

![Screenshot of diff extension](http://contentful.github.io/extensions/assets/diff-extension.png)

The diff editor extension shows the diff between the draft value and the
published value of a short text field.

#### [Chessboard](./samples/chessboard)

![Chessboard extension in action](http://contentful.github.io/extensions/assets/chessboard.gif)

This example displays a chessboard and stores the board position as a JSON
object. You can drag pieces on the chessboard and the position data will be
updated automatically. The extension also supports *collaborative editing*. If
two editors open the same entry moves will be synced between them. It highlights
the flexibility and potential of solutions that can be built using the UI
Extensions SDK.
