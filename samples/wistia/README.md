# Wistia Extension

[https://www.contentful.com](Contentful) is a content management platform for web applications, mobile apps and connected devices. It allows you to create, edit & manage content in the cloud and publish it anywhere via powerful API. Contentful offers tools for managing editorial teams and enabling cooperation between organizations.

This extension loads videos from a [wistia project](http://wistia.com/doc/projects) into the Contentful Web App. You can then preview, select and store the video as part of your content.

![Screenshot of Wistia extension](http://contentful.github.io/extensions/assets/wistia.gif)

## Installation and usage

[Check you have the requirements needed](../README.md#extensions-samples) to use our extensions and [have the extensions SDK installed](https://github.com/contentful/ui-extensions-sdk).

You will need an account on [wistia](http://wistia.com/) and an API key, preferably with read-only permissions.

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

Compile the bundle to an _index.html_ to upload to your space.

```bash
npm run bundle
```

Create the extension in your space:

```bash
npm run extension:create
```

## Update the extension

To update the extension, first update teh bundle with webpack and then update the extension in your space:

```bash
npm run bundle
npm run extension:update
```

## Local development

Start a local server, changing the port if needed:

```bash
python -m SimpleHTTPServer 3030
```

Tell Contentful to render the widget from your local machine:

```bash
npm run bundle
npm run extension:dev
```

The [same constraints](../README.md) relative to loading unsafe scripts apply.

## Using the extension in the Contentful web app

Enable the extension in the Contentful web app for a "Short text" field by opening the _Settings_ for a field and selecting the widget in the _appearance_ tab.
