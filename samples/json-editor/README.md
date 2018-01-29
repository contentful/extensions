# JSON Editor extension

[Contentful](https://www.contentful.com) is a content management platform for web applications, mobile apps, and connected devices. It allows you to create, edit, and manage content in the cloud and publish it anywhere via powerful APIs. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

![json-editor-ok](http://contentful.github.io/extensions/assets/json-editor.png)

This extension provides a JSON formatter and validator for the Contentful web app based on the [Codemirror](http://codemirror.net) library. You can use this extension with `Object` field types.

## Getting started with local development

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions.

Install the dependencies needed with `npm install`.

Create the extension:

```bash
contentful extension create --space-id <yourSpaceId>
```

Serve on _<http://localhost:3000>_ using Gulp, automatically watching and reserving any changes:

```bash
gulp watch
```

The [same constraints](../README.md#debugging-on-your-local-environment) apply to loading unsafe scripts.

## Using the extension in production

To help reduce the code size when used in production, we recommend you take the following steps when using it in production:

- Host it on your own environment, using HTTPS and CORS enabled.
- Update the _extension.prod.json_ file to reflect your server details.
- Update your space using the new description file:

  ```bash
  contentful extension update --descriptor extension.prod.json --force --space-id <yourSpaceId>
  ```
