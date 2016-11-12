Wistia Extension
-------------

The wistia extension loads videos from a [project](http://wistia.com/doc/projects) on [wistia](http://wistia.com/) into the Contentful Web App. A video can be easily previewed, selected and then stored as part of your content. In this example we store the video embed URL in Contentful so the video can be embedded easily.

![Screenshot of Wistia extension](http://contentful.github.io/extensions/assets/wistia.gif)

### Requirements

Cf. [the samples requirements listed here](../README.md)

You also need to the following for using Wistia:
  - an account on [wistia](http://wistia.com/)
  - an API key from wistia, preferably with read-only permissions only

### Installation

- Install dependencies if not done already through `npm install`
- Create a configuration file with your credentials for Contentful
```bash
touch .env
echo "export SPACE_ID={YOUR-SPACE-ID}" >> .env
echo "export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN={YOUR-MANAGEMENT-TOKEN}" >> .env
source .env
```
and replace space ID, management token and port accordingly.

### Upload the extension to Contentful

- Compile the bundle (index.html) which we are going to upload to our space
```bash
npm run bundle
```
- Create the extension in your space on Contentful
```bash
npm run extension:create
```

### Update the extension

- Make sure to update your bundle with webpack
- Update the extension in your space on Contentful
```bash
npm run bundle
npm run extension:update
```

### Local development

- Start a local server (replace your port if needed)
```bash
python -m SimpleHTTPServer 3030
```
- Tell contentful to render the extension from your local machine
```bash
npm run bundle
npm run extension:dev
```

The [same constraints](../README.md) relative to loading unsafe scripts apply.

### Using the extension in the Contentful App

Next, we will enable the extension in the Contentful App for a “Short text” field so that you can see it in action.

In your space, choose any Content Type with a “Short text” field or create a new one. Then open the “Settings” dialog for a field and switch to the appearance tab. An extension with the name “Wistia video extension” should be visible at the end of the list. (Note that you need to reload the app after you uploaded a extension.) Select the extension from the list and save the Content Type. Finally you can open an entry for that Content Type and see the extension rendered.
