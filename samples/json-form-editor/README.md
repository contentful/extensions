# JSON Form Editor extension

This extension provides a JSON form editor (based on the [JSON Editor](https://github.com/jdorn/json-editor)) library. You can use this extension with 'Object' field types.

The extension generates a form based on a [JSON Schema](https://json-schema.org/) defined in [schema.json.js](./src/schema.json.js). The generated form allows you to create JSON objects that are valid against that schema.

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

## TODOs

- Make JSON Schema configurable as a field appearance option.
- Add advanced form editor styling to _json-editor-contentful-theme.js_.
- Trigger auto-save while typing, not just after leaving an input field.
