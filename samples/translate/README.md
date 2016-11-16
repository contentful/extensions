# Translation extension

[https://www.contentful.com](Contentful) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

![translate-widget](http://contentful.github.io/extensions/assets/translate-widget.png)

This extension translates text from the default locale to other locales in a space using the [Yandex](https://translate.yandex.com/) translation API.

## Installation and usage

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions and [have the extensions SDK installed](https://github.com/contentful/ui-extensions-sdk).

Install the dependencies needed with `npm install`.

Set your access token in your environment:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<content-management-access-token>
```

Create the extension:

```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on _<http://localhost:3000>_:

```bash
npm start
```

You can provide a value for the `PORT` environment variable to start the server on a custom port. If you do, remember to update the `src` property in _extension.json_.

```bash
export PORT=<custom-port>
npm start
```

Your extension will now be accessible in the Contentful web app. To use the extension, create a content type with a field of type 'Symbol' or 'Text'. You will need to enable localization on the field to use the translation feature.

The [same constraints](../README.md#debugging-on-your-local-environment) apply to loading unsafe scripts.

### Upload extension

If you want to inline all dependencies and upload the extension to Contentful, run the following command:

```bash
contentful-extension create --srcdoc ./dist/index.all.html --space-id <space-id> --force
```

And to update the extension:

```bash
contentful-extension update --srcdoc ./dist/index.all.html --space-id <space-id> --force
```
