## Vanilla HTML5 UI Extension template

We prepared a vanilla HTML5 UI Extension template implementing the basic lifecycle methods to better understand the concept.

The template renders in the Contentful Web App like this:

![Screenshot of template](http://contentful.github.io/extensions/assets/uiextensions-vanilla-extension.png)

The template includes:
- the [UI Extensions SDK][extensions-sdk] library
- a Contentful look-and-feel by loading our CSS library
- basic handling of user-generated events (here: keyboard input)
- basic handling of externally generated events (here: changes introduced by other authors)
- cleanup of event listeners

[extensions-sdk]: https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md
