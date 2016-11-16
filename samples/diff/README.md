# Diff UI Extensions

[https://www.contentful.com](Contentful) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

![Screenshot of Diff extension](http://contentful.github.io/extensions/assets/diff-extension.png)

The diff editor extension shows the diff between the draft value and the published value of a short text field.

## Installation and usage

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions and [have the extensions SDK installed](https://github.com/contentful/ui-extensions-sdk).

Install the dependencies needed with `npm install`.

Create a _.env_ configuration file with your Contentful credentials:

```bash
export SPACE_ID=<space-id>
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<content-management-access-token>
```

Add the variables to your environment.

```bash
source .env
```

## Upload the extension to Contentful

Create the extension in the space specified in the _.env_ file:

```bash
npm run create
```

## Local development

Start a local server, changing the port if needed:

```bash
python -m SimpleHTTPServer 3030
```

Tell Contentful to render the widget from your local machine:

```bash
npm run dev
```

The [same constraints](../README.md#debugging-on-your-local-environment) apply to loading unsafe scripts.

## Update the extension

If you want to update the extension, run:

```bash
npm run update
```

## Using the extension in the Contentful web app

Enable the extension in the Contentful web app for a "Short text" field by opening the _Settings_ for a field and selecting the widget in the _appearance_ tab.
