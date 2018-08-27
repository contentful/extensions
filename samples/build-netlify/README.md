# Build Netlify

This Sidebar Extension shows how to use Netlify API so you could trigger Netlify builds manually while editing content.

![Screenshot of extension](../../docs/assets/netlify-build.png "Screenshot of extension")

## Requirements

1. Get Build URL on [Netlify](https://www.netlify.com/docs/webhooks/).
   * You can provide this information on real setup.
2. (optional) If you want to see the status of the build you triggered, you need to provide the following information:
   * Get [Personal Access Token](https://app.netlify.com/account/applications)
   * Get API ID of your site in Site Details.
   * **We would not recommend to expose this information on real setup, use only for demo purpose**

## Setup

1. Setup extension.
2. Go to *Content model* and create new field.
![Create new field](../../docs/assets/netlify-build-step-2.png "Create new field")
3. Go to *Appearance* tab and provide all required information.
![Provide information](../../docs/assets/netlify-build-step-3.png "Provide information")
4. Save changes in *Content model*
5. Edit your content and build your website when you feel it's time to build.

