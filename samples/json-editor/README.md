# JSON Editor extension

![json-editor-ok](http://contentful.github.io/extensions/assets/json-editor.png)

[https://www.contentful.com](Contentful) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

This extension provides a JSON formatter and validator for the Contentful web app based on the [Codemirror](http://codemirror.net) library. You can use this extension with 'Object' field types.

## Bootstrap example for local development

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions and [have the extensions SDK installed](https://github.com/contentful/ui-extensions-sdk).

Install the dependencies needed with `npm install`.

Set the access token in your environment:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<content-management-access-token>
```

Create the extension:

```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on _http://localhost:3000_ using Gulp:

```bash
gulp
```

The [same constraints](../README.md) relative to loading unsafe scripts apply.

## Using the extension in production

To help reduce the code size when used in production, we recommend you take the following steps when using it in production:

- Host it on your own environment, using HTTPS and CORS enabled.
- Update the _extension.prod.json_ file to reflect your server details.
- Update your space using the new description file:

  ```bash
  contentful-extension update --descriptor extension.prod.json --force --space-id <yourSpaceId>
  ```
