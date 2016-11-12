### Contentful extensions samples

This folder lists a various set of extensions using the [UI extensions SDK](https://github.com/contentful/ui-extensions-sdk).

### Requirements

All the provided samples require that you have the following elements available:
- Contentful
  - a space to use the widget and the space id
  - an API key for Contentful's Mangement API
- Local machine
  - `npm` installed and configured on your system for dependencies management.
  - `gulp` for enabling most of these sample to be built.
  ```bash
  npm install -g gulp
  ```
  - `contentful-extension` for uploading extensions to Contentful.
  ```bash
  npm install -g contentful-extension
  ```

### Common preparation steps

Each sample will require that you proceed with the following steps:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
npm install
```

### Notes relative to debugging from your local environment

Since the Contentful App is served through HTTPS while the extension code is
loaded from your local machine through HTTP, you need to enable insecure content.
See here how to do it in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
[chrome-mixed]: https://support.google.com/chrome/answer/1342714
