# AI Image Tagging

This extension enables automatic tagging of images.

![Screenshot of extension](http://contentful.github.io/extensions/assets/ai-image-tagging.jpg "Screenshot of extension")

To use, configure it in the Sidebar of a content type that includes two fields at minimum:

 - A `Media` field to serve as the image source
 - A `Short text, list` field to store the generated tags
 
After adding the extension to the sidebar, click 'Change instance parameters' on the image-tagging extension card.
In the following configuration dialog, set both the image field and tag field id to the id's of the
fields of your content type.

Then just add an image to your image field and click `Auto-tag image`. The generated 
tags should be added to your tags field once ready.
