# Contentful UI Extension

[Commerce Layer](https://commercelayer.io/) is an API-first commerce platform that lets you easily add enterprise-grade e-commerce to any website. Take a look at this [example](https://github.com/commercelayer/contentful-commerce) to see an example Static e-commerce site built with Commerce Layer, Jekyll and Contentful.

This extension lets you visually associate an SKU on Commerce Layer to any model on Contentful. The association brings the SKU `code` into the content model, so that you can make it shoppable on the front-end by leveraging the Commerce Layer API.

![Demo](demo.gif?raw=true 'Demo')

## Installation

Install the extension on Contentful by adding the [extension.json](extension.json) URL on the installation dialog box or clicking install on this page:

![Contentful extension](contentful_extension.png?raw=true 'Contentful extension')

Create a `contentful` application on Commerce Layer and get the client ID, client secret, and base endpoint:

![Contentful application](contentful_application.png?raw=true 'Contentful application')

Create a field of type `JSON object` and insert your application credentials in the field appearance options:

![Contentful field](contentful_field.png?raw=true 'Contentful field')

## Usage

Once installed, head over to any content that contains the Commerce Layer field to be able to associate Commerce Layer SKUs with your content in Contentful.

## License

This extension is published under the [MIT](LICENSE) license.
