# Netlify Build and Preview

This sidebar extension allows you to build and preview up to 3 Netlify sites.

This is an alternative approach to using a webhook to trigger a build. The advantage
is that the editor gets control on when a build is executed instead of responding
to automatic events such as `Entry.publish`.

![Netlify Sidebar UI Sample](./assets/netlify-triggering.gif)

## Requirements
+ A Netlify site
+ Netlify webhooks setup, [see their documentation](https://www.netlify.com/docs/webhooks/)

## Installation

Navigate to the Extensions page to install the extension and provide the
correct credentials into the required fields then click "Save".

![Netlify Installation Config](./assets/setup.png)

Navigate to the Content model page. You can enable the Netlify Build and Preview Sidebar extension
indivdually for any content type sidebar.

![Netlify Installation to Sidebar](./assets/sidebar-installation.gif)