# JSON Form Editor extension

[https://www.contentful.com](Contentful) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

This extension provides a JSON form editor based on the [JSON Editor](https://github.com/jdorn/json-editor)) library. You can use this extension with 'Object' field types.

The extension generates a form based on a [JSON Schema](https://json-schema.org/) defined in _json-form-editor.js_. The generated form allows you to create JSON objects that are valid against that schema.

## Getting started with local development

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions and [have the extensions SDK installed](https://github.com/contentful/ui-extensions-sdk).

Install the dependencies needed with `npm install`.

Create the extension on Contentful:

```bash
contentful-extension create --space-id <space-id>
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
contentful-extension update --srcdoc ./dist/index.min.html --force --space-id <space-id>
```

## TODOs

- Make JSON Schema configurable as a field appearance option.
- Add advanced form editor styling to _json-editor-contentful-theme.js_.
- Trigger auto-save while typing, not just after leaving an input field.
