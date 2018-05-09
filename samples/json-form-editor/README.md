# JSON Form Editor extension

This extension provides a JSON form editor (based on the [JSON Editor](https://github.com/jdorn/json-editor)) library. You can use this extension with 'Object' field types.

The extension generates a form based on a [JSON Schema](https://json-schema.org/) defined in [schema.json.js](./src/schema.json.js). The generated form allows you to create JSON objects that are valid against that schema.

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

## Getting started with local development

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions.

Install the dependencies needed with `npm install`.

Create the extension on Contentful:

```bash
contentful extension create --space-id <space-id>
```

Serve on _<http://localhost:3000>_ using Gulp, automatically watching and reserving any changes:

```bash
gulp watch
```

The [same constraints](../README.md#debugging-on-your-local-environment) apply to loading unsafe scripts.

## Using the extension in production

To minimize all dependencies and upload the extension to Contentful:

```bash
gulp bundle
contentful extension update --srcdoc ./dist/index.min.html --force --space-id <space-id>
```

## TODOs

- Make JSON Schema configurable as a field appearance option.
- Add advanced form editor styling to _json-editor-contentful-theme.js_.
- Trigger auto-save while typing, not just after leaving an input field.
