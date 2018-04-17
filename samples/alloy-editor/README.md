Alloy Editor Extension
-------------------

![alloy-editor](http://contentful.github.io/extensions/assets/alloy-editor.png)

This extension uses the [Alloy Text Editor][alloy] to edit text fields.

## Installation and usage

Ensure you checked [the samples requirements listed here](../README.md).

Install dependencies if not done already through `npm install`.

To use the extension from your local environment:
* Fill in your space id in the `Makefile`.
* Run `make create` to upload your extension to the server
* Run `make serve` to serve the extension
* Setup your content type an open the entry editor.

You will now be able to use Alloy Editor, hosted on your local environment.

Once you're done with testing the local environment:
* Run `make update-force` to update the extension using the built version as a source, hosted on Contentful

If you need to go back to the locally hosted version, you must run `make update-local`.

The [same constraints](../README.md#debugging-on-your-local-environment) apply to loading unsafe scripts.

Learn more about [Alloy editor][alloy]

[alloy]: http://alloyeditor.com/
