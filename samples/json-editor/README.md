# JSON Editor extension

![json-editor-ok](http://contentful.github.io/ui-extensions-sdk/assets/json-editor.png)

This extension provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net) library.

It should be used with fields with the type “Object”.


### Bootstrap example for local development

First set the access token on your environment:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
```

Move into example directory and install dependencies
```bash
cd examples/json-editor && npm install
```

Create the extension:
```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on http://:::3000
```bash
gulp
```

### Upload extension
If you want to inline all dependencies and upload the extension entirely to Contentful:
```bash
contentful-extension update --descriptor extension.debug.json --space-id <yourSpaceId> --force
```

Please note that as soon as the concatenated file gets over 200k, you'll have to host it on your own server, using HTTPS and with CORS enabled.
