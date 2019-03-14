# AI Image Tagging

This extension enables automatic tagging of images.

![Screenshot of extension](http://contentful.github.io/extensions/assets/ai-image-tagging.jpg "Screenshot of extension")

To use, configure it in the Sidebar of a content type that includes two fields at minimum:

 - A `Media` field to serve as the image source
 - A `Short text, list` field to store the generated tags

Then just add an image to your image field and click `Auto-tag image`. The generated 
tags should be added to your tags field once ready.

 ## Installation

This extension uses the Contentful cli for installation and management. To get started
run

`npm install`

to install all required dependencies.
Then log into Contentful by running

`npm run login` 

You can skip this if you're already logged in via the CLI. To deploy the extension run

`npm run deploy`

and choose the space you want to deploy it to from the menu.

To use the extension, add it to the sidebar of the content type you want to be able to tag automatically.
This can be configured under `Content Types>Your Content Type`, click `Sidebar` and enable `Use custom sidebar`. Then drag
`Image-Tagging` into the sidebar of your content type.
