# Contentful UI Extension

This extension lets you visually associate an SKU to any model on Contentful. The association brings the SKU `code` into the content model, so that you can make it shoppable on the front-end by leveraging the Commerce Layer API ([example](https://github.com/commercelayer/static-commerce)).

![Demo](demo.gif?raw=true 'Demo')

## Installation

Install the extension on Contentful by adding the [extension.json](extension.json) URL on the installation dialog box:

![Contentful extension](contentful_extension.png?raw=true 'Contentful extension')

Create a `contentful` application on Commerce Layer and get the client ID, client secret, and base endpoint:

![Contentful application](contentful_application.png?raw=true 'Contentful application')

Create a field of type `JSON object` and insert your application credentials in the field appearance options:

![Contentful field](contentful_field.png?raw=true 'Contentful field')

## About

[Commerce Layer](https://commercelayer.io/) is an API-first commerce platform that lets you easily add enterprise-grade e-commerce to any website, by using the headless CMS, static site generator, and tools you already master and love.

## License

This repository is published under the [MIT](LICENSE) license.
