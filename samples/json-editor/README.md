# JSON Editor extension

![json-editor-ok](http://contentful.github.io/extensions/assets/json-editor.png)

This extension provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net) library.

It should be used with fields with the type “Object”.

### Bootstrap example for local development

Ensure you checked [the samples requirements listed here](../README.md).

Install dependencies if not done already through `npm install`.

Set the access token on your environment:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
```

Create the extension:
```bash
contentful-extension create --space-id <yourSpaceId>
```

Serve on http://localhost:3000
```bash
gulp
```
The [same constraints](../README.md) relative to loading unsafe scripts apply.

### Use this extension in production
Since this extension grows above 200k when inlined, you need to:
 - Host it on your own environment, using HTTPS and with CORS enabled.
 - Update the extension.prod.json.
 - Update your space using the updated descriptor:
 ```bash
 contentful-extension update --descriptor extension.prod.json --force --space-id <yourSpaceId>
 ```
