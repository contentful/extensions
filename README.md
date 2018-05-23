# Contentful extensions repository

This repository provides core field editors and samples of Contentful
extensions, developed using the [UI Extensions SDK][url-extensions-sdk].

## Sections
- In [core field editor extensions](#core-field-editor-extensions) you will find code of some of our core editor components.
- [Custom extension examples](#custom-extension-examples) is a curated list of common problems solvable with an extension.
- [Managing extensions](#managing-extensions) explains how to manage extensions in a Contentful space using our `CLI`.
- [Resources](#resources) offers a collection of useful links.

## Core field editor extensions

We're progressively opening our [core field editors](./core-field-editors) within this repository, allowing you to understand how each component works, and create your own extensions based on them rather than starting from scratch.

## Custom extension examples

Each example comes with a README file explaining how to build and use it.
They're showing various types of integrations with popular frameworks or build
systems like:
- npm
- Gulp
- Makefile
- Webpack
- Babel

**List of examples:**

[Basic Rating Dropdown](./samples/rating-dropdown) is a basic extension meant to help you *get started* with custom
extensions development. Uses a dropdown to change the value of a number field
and makes some CMA requests.

[Rich Text Editor](./samples/alloy-editor) integrates the [Alloy rich-text/HTML editor](http://alloyeditor.com/)
to edit “Text” fields. Great to personalize the entry editor and enable HTML
editing as an alternative to Markdown.

[Slug Generator](./samples/slug) automatically generates its value from an entry's title field. For example typing “Hello World” into the title field will set the extensions input field to “hello-world”. It will also check the uniqueness of the slug across a customizable list of content types.

[JSON Editor](./samples/json-editor) provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net)
library. It can be used with fields of type “Object”.

[JSON Form Editor](./samples/json-form-editor) integrates the [JSON Editor](https://github.com/jdorn/json-editor) library to display an edit form based on a predefined [JSON Schema](https://json-schema.org/).
Form input gets stored as a JSON object.

[Translator](./samples/translate) translates text from the default locale to other locales in a space
using the Yandex translation API.

[YouTube ID](./samples/youtube-id) extracts the video id from a valid YouTube URI. Useful as a simple
way to integrate with 3rd party media services.

[Diffing Published and Draft](./samples/diff) shows the diff between draft value and published value of a short text field.

[Chessboard](./samples/chessboard) displays a chessboard and stores the board position as a JSON object. You can drag pieces on the chessboard and the position data will be
updated automatically. The extension also supports *collaborative editing*.

[External API](./samples/external-api) demonstrates accessing an external API and storing the underlying data within contentful.

[Optimizely Audiences](./samples/optimizely-audiences) demonstrates how structured content can be tagged with audience Ids loaded from an Optimizely project.

[Shopify](./samples/shopify) integrates your shopify account to search and select products to display on your frontend.

## Managing extensions

> tl;dr This section explains how to manage extensions in a Contentful space  through the Contentful CLI.

Extensions are managed within a Contentful space through the Content Management API's [`extensions`](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/ui-extensions) endpoint. To make it more convenient we added support for extensions to the [Contentful CLI][url-contentful-cli].

## Requirements

- Installed [Contentful CLI][url-contentful-cli] so the `contentful` command is available
- An account at [Contentful][url-contentful] with admin access to a space

## Usage

### Hosting options

Extensions can be hosted within the Contentful web app in two forms:

- **Internally hosted:** The extension's source code was uploaded to Contentful as a bundled string where all local dependencies need to be inlined into one single file. Internal extensions are uploaded by using the `srcdoc` property and have a **limit of 200kb**. Use internal hosting if you don't want to host anything on your own and can accept the drawbacks (need for a non-standard build, file size limitation). Note that internal hosting is [not supported](https://caniuse.com/#feat=iframe-srcdoc) on Internet Explorer and Microsoft Edge.
- **3rd party hosted:** The extension's source code was uploaded to a 3rd party server by using the `src` property. Relative links in the root HTML are supported as expected. Use 3rd party hosting when you want to be as flexible as possible with your development and deployment process.

### Extension properties

The following table describes the properties that can be set on an extension.

Property | Required| Type | Description
---------|---------|------|------------
id | yes | String | Extension id
name | yes | String | Extension name
fieldTypes | yes | Array\<String\> * | The [field types of a content type](https://www.contentful.com/developers/docs/concepts/data-model/#fields)  where an extension can be used
src | ** | String | URL where the root HTML document of the extension can be found
srcdoc | ** | String | Path to the local extension HTML document
sidebar | no | Boolean | Controls the location of the extension. If `true` it will be rendered on the sidebar


\* Valid field types are: `Symbol`, `Symbols`, `Text`, `Integer`, `Number`, `Date`, `Boolean`, `Object`, `Entry`, `Entries`, `Asset`, `Assets`.

\*\* One of `src` or `srcdoc` is required.

### Descriptor files
The properties of an extension can be stored in a descriptor JSON file for convenience. The descriptor file can be passed to the CLI so the properties don't have to be provided individually.

#### 3rd party hosted
```JSON
{
  "id": "foo-extension",
  "fieldTypes": ["Symbol", "Text"],
  "name": "My wonderful foo extension",
  "sidebar": false,
  "src": "https://foo.com/extension"
}
```

#### Internally hosted
```JSON
{
  "id": "foo-extension",
  "fieldTypes": ["Symbol", "Text"],
  "name": "My wonderful foo extension",
  "sidebar": false,
  "srcdoc": "./dist/bundle.html"
}
```

### Commands

As with most other resources at Contentful, extension can be

`contentful extension` is composed of 5 subcommands that you can use to manage extensions:

**Create**

```
contentful extension create [options]
```
Creates an extension for the first time. Successive modifications made to the extension to use the `update` subcommand.

**Update**

```
contentful extension update [options]
```
Modifies an existing extension.

**Delete**

```
contentful-extension delete [options]
```

Permanently deletes an extension.

**Read**

```
contentful extension get [options]
```
Reads the extension payload from Contentful.

**List**

```
contentful-extension list [options]
```

Use this subcommand to see what extensions are created for a given space.

### CLI documentation
To learn how the commands work in the CLI, either use the CLI's inline help

```bash
contentful extension --help
```

or head over to the [documentation][url-contentful-cli-docs] of the CLI.

### Version locking

Contentful API use [optimistic locking](https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/updating-and-version-locking) to ensure that accidental non-idemptotent operations (`update` or `delete`) can't happen.

This means that the CLI  needs to know the current version of the extension when using the `update` and `delete` subcommands. On these case you have to specify the version of the extension using the `--version` option.

If you don't want to use the `--version` option on every update or deletion, the alternative is to use `--force`. When the `--force` option is present the CLI will automatically use the latest version of the extension. Be aware that using `--force` option might lead to accidental overwrites if multiple people are working on the same extension.

### Programmatic usage
If you need to manage extension programmatically consider using one of the [Content Management SDKs](https://www.contentful.com/developers/docs/platforms/) we are offering.

---
### Resources
- [Contentful Blog: Creating UI extensions with Contentful](https://www.contentful.com/blog/2017/10/09/creating-ui-extensions-with-contentful/)
- [Contentful Blog: Contentful, my way: build custom extensions with this new SDK](https://www.contentful.com/blog/2016/07/06/ui-extensions-sdk/)
- [Guide: Extending the Contentful web app](https://www.contentful.com/r/knowledgebase/ui-extensions-guide/)
- [UI Extensions SDK][url-extensions-sdk]
- [Contentful CLI][url-contentful-cli]

[url-contentful-cli]: https://github.com/contentful/contentful-cli
[url-contentful-cli-docs]: https://github.com/contentful/contentful-cli/tree/master/docs/extension
[url-contentful]: https://www.contentful.com
[url-extensions-sdk]: https://github.com/contentful/ui-extensions-sdk
