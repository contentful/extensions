# Getting Started with Contentful extensions

![rating-dropdown](http://contentful.github.io/extensions/assets/rating-dropdown.png)

This guide will walk you through uploading, using, and making changes to
your first extension.

1. [Uploading the extension to a space](#uploading-the-extension-to-a-space)
2. [Using the extension in the Contentful App](#using-the-extension-in-the-contentful-app)
3. [Making changes to the code](#making-changes-to-the-code)

This example extension presents the user with a simple dropdown and writes
number values to the API depending on the selection. It also allows the
user to request a list of entries with the same value at the field the
extension is attached to.

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions.

[readme-getting-started]: https://github.com/contentful/ui-extensions-sdk#getting-started

## Uploading the extension to a space

The first step is to have two files which define the extension in a local folder:
* [`extension.json`](./extension.json) containing meta data (more info on the format of this file [here](../../README.md#descriptor-files))
* [`app.html`](./app.html) containing markup and logic

The second step is to register the extension with the Contentful API to
make the Contentful App aware of its existence.

~~~bash
contentful extension create --space-id MY_SPACE_ID
~~~

The `contentful extension` command will upload the data defined in
[`extension.json`](./extension.json) and register it with our app.
The `extension.json` file look like this.

~~~json
{
  "id": "number-dropdown",
  "name": "Rating Dropdown",
  "srcdoc": "./app.html",
  "fieldTypes": ["Integer", "Number"]
}
~~~

The file references `app.html` which contains the code loaded by the
Contentful App.

Checkout the documentation [here](../../README.md#descriptor-files) for more information on the `extension.json` files.


## Using the extension in the Contentful App

Next, we will enable the extension in the Contentful App for a
“Number” field so that you can see it in action.

In your space, choose any Content Type with a “Number” field or create
a new one. Then open the “Settings” dialog for a field and switch to
the appearance tab. An extension with the name “Rating Dropdown” should be
visible at the end of the list. (Note that you need to reload the app
after you uploaded an extension.) Select the extension from the list and save
the Content Type.  Finally you can open an entry for that Content Type
and see the extension rendered.


## Making changes to the code

To simplify development you can host your extension locally.

~~~bash
contentful extension update --space-id MY_SPACE_ID --force --src "http://localhost:8000/app.html"
python -m SimpleHTTPServer 8000
~~~

This will update the extension and tell the Contentful App to load the extension from
`http://localhost:8000/app.html` instead of loading it from the API. It will
also run a static server to serve that file. (If you don’t have Python installed
there are [various ways to serve static files][static-one-liners].)


If you now open an entry that uses the extension in your browser it will use the
code from your local machine. You need to enable insecure content since the
Contentful App is served through HTTPS but your extension is not. See here how to
do it in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

All the code needed to run the extension is contained in `app.html` and
documented there. If you make any changes to that file and reload the
browser page, your changes will be reflected in the extension.

If you want to deploy the code from `app.html` directly again, without
having to serve it locally, you can run
~~~bash
contentful extension update --space-id MY_SPACE_ID --force
~~~

You can go on from here by having a look at the
[UI Extensions API documentation](https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md) documentation.


[static-one-liners]: https://gist.github.com/willurd/5720255
[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
[chrome-mixed]: https://support.google.com/chrome/answer/1342714
[ui-ext-api-doc]: https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md
