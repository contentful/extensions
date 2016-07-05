# Translation extension

![translate-widget](http://contentful.github.io/ui-extensions-sdk/assets/translate-widget.png)

This extension translates text from the default locale to other locales in a space using the Yandex translation API.

### Bootstrap example for local development

Move into this example directory and install dependencies
```bash
cd examples/translate
npm install
```

Set the access token on your environment:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
```

Create the extension:
```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on http://:::3000
```bash
npm start
```

You can also provide a value for `PORT` environment variable to start the server on a custom port.
If you do this, remember to update the `src` property in `extension.json`.
```bash
PORT=<custom port here> npm start
```

Your extension will now be accessible via the Contentful web app.
In order to to use this extension, create a Content Type with a field of type `Symbol` or `Text`. You will need to enable localization on the field to use the translation feature.


### Upload extension
If you want to inline all dependencies and upload the extension entirely to Contentful:
```bash
contentful-extension create --srcdoc ./dist/index.all.html --space-id <yourSpaceId> --force
```
