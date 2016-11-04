# JSON Form Editor extension

![json-form-editor](http://contentful.github.io/extensions/assets/json-form-editor.png)

This extension provides a JSON form editor based on the
[JSON Editor](https://github.com/jdorn/json-editor)) library. It should be used
with fields of the type “Object”.

The extension generates a form based on a [JSON Schema](https://json-schema.org/)
defined in `json-form-editor.js`. The generated form allows to create JSON objects
valid against that schema.


## Bootstrap example for local development

In the directory containing this README, run
```bash
npm install
```

First set the access token on your environment, then create the extension on Contentful:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
contentful-extension create --space-id <yourSpaceId>
```

Serve on `http://localhost:3000/`:
```bash
gulp watch
```
This does automatically serve again on any change to the source files, so you only
need to manually refresh your browser to see the changes.

**Note:** Since the Contentful App is served through HTTPS while the extension code is
loaded from your local machine through HTTP, you need to enable insecure content.
See here how to do it in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
[chrome-mixed]: https://support.google.com/chrome/answer/1342714

## Upload extension
If you want to inline all dependencies and upload the extension entirely to Contentful:
```bash
gulp bundle
contentful-extension update --srcdoc ./dist/index.min.html --space-id <yourSpaceId> --force
```


## TODOs
* Make JSON Schema configurable as a field appearance option.
* Add some advanced form editor styling to `json-editor-contentful-theme.js`.
* Trigger auto-save while typing, not just after leaving an input field.
