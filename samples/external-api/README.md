# External API UI Extension

## Summary

This extension demonstrates accessing an external API and storing the underlying data within Contentful.

The API does not need to satisfy any requirements for response format.

![Screenshot of extension](https://github.com/contentful/extensions/raw/master/docs/assets/external-api-extension.jpg)

## Description

Consuming the external API is performed similar to a standalone application. This demo uses `fetch` with a [polyfill](https://www.npmjs.com/package/whatwg-fetch) to perform an AJAX request for dummy data from jsonplaceholder.typicode.com.

Once the API responds, React and Forma 36 are used to build a dropdown of options. The Contentful UI Extension SDK provides access to persist data sourced from the service to the underlying data model.

See the [UI Extension SDK documentation](https://github.com/contentful/ui-extensions-sdk) for a full description of its capabilities.

## Next Steps

Adding additional behaviors to the extension are simple. You can add more information to the dropdown, display images, etc. by modifying or replacing the code generating the dropdown.
