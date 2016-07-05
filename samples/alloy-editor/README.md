Alloy Editor Extension
-------------------

![alloy-editor](http://contentful.github.io/ui-extensions-sdk/assets/alloy-editor.png)

This extension uses the [Alloy Text Editor][alloy] to edit text fields.

To use the extension from your local environment:
* Install dependencies with `npm install`
* Fill in your authentication data and space id in the `Makefile`.
* Run `make create` to upload your extension to the server
* Run `make serve` to serve the extension
* Setup your content type an open the entry editor.

You will now be able to use Alloy Editor, hosted on your local environment.

Once you're done with testing the local environment:
* Run `make update-force` to update the extension using the built version as a source, hosted on Contentful

If you need to go back to the locally hosted version, you must run `make update-local`

Learn more about Alloy editor:
[alloy]: http://alloyeditor.com/
