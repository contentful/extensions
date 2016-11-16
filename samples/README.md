# Contentful extensions samples

This folder contains a set of extensions using the [UI extensions SDK](https://github.com/contentful/ui-extensions-sdk).

## Requirements

All the samples require the following dependencies:

### Contentful

- a space to use the widget and the space id.
- an API key for Contentful's Mangement API.

### Local machine

- [npm](https://www.npmjs.com/) installed and configured for dependencies management.
- [gulp](http://gulpjs.com/) for building most samples.
- The [contentful-extension](https://github.com/contentful/contentful-extension-cli) npm module for uploading extensions to Contentful.

## Common preparation steps

Each sample will need you to set [your management API token](https://www.contentful.com/developers/docs/references/authentication/) and install the dependencies for the extension:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<content-management-access-token>
npm install
```

## Debugging on your local environment

As the Contentful web app is served over HTTPS but your local machine is likely HTTP, you will need to enable access to insecure content.

Read how to do that in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[chrome-mixed]: https://support.google.com/chrome/answer/1342714
[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
