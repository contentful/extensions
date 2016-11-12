# JSON Form Editor extension

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

This extension provides a JSON form editor based on the
[JSON Editor](https://github.com/jdorn/json-editor)) library. It should be used
with fields of the type “Object”.

The extension generates a form based on a [JSON Schema](https://json-schema.org/)
defined in `json-form-editor.js`. The generated form allows to create JSON objects
valid against that schema.

## Bootstrap example for local development

Ensure you checked [the samples requirements listed here](../README.md).

Install dependencies if not done already through `npm install`.

Create the extension on Contentful:
```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on `http://localhost:3000/`:
```bash
gulp watch
```
This does automatically serve again on any change to the source files, so you only
need to manually refresh your browser to see the changes.

The [same constraints](../README.md) relative to loading unsafe scripts apply.

## Upload extension for production usage
If you want to inline all dependencies and upload the extension entirely to Contentful:
```bash
gulp bundle
contentful-extension update --srcdoc ./dist/index.min.html --force --space-id <yourSpaceId>
```

## TODOs
* Make JSON Schema configurable as a field appearance option.
* Add some advanced form editor styling to `json-editor-contentful-theme.js`.
* Trigger auto-save while typing, not just after leaving an input field.
