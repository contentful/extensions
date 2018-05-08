# Contentful extensions samples

This folder contains a set of extensions using the [UI extensions SDK](https://github.com/contentful/ui-extensions-sdk).

## Requirements

All the samples require the following dependencies:

### Contentful

- A space to use the widget and the space id.

### Local machine


- The [contentful cli](https://github.com/contentful/contentful-cli) for uploading extensions to Contentful.
- [npm](https://www.npmjs.com/) installed and configured for dependencies management.
- [gulp](http://gulpjs.com/) for building some samples.

## Common preparation steps

Each sample will need you to use the [Contentful CLI](https://github.com/contentful/contentful-cli):

```bash
contentful login
```

## Debugging on your local environment

As the Contentful web app is served over HTTPS but your local machine is likely HTTP, you will need to enable access to insecure content.

Read how to do that in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[chrome-mixed]: https://support.google.com/chrome/answer/1342714
[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
