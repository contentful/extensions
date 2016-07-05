Wistia Extension
-------------

The wistia extension loads videos from a [project](http://wistia.com/doc/projects) on [wistia](http://wistia.com/) into the Contentful Web App. A video can be easily previewed, selected and then stored as part of your content. In this example we store the video embed URL in Contentful so the video can be embedded easily.

![Screenshot of Wistia extension](http://contentful.github.io/ui-extensions-sdk/assets/wistia.gif)

### Requirements

- Contentful
    - a space to use the extension and the space id
    - an api key for Contentful's Mangement API
- Wistia
    - an account with [wistia](http://wistia.com/)
    - an API key from wistia, preferably with read-only permissions only
- Local machine
    - npm installed and configured on your system

### Installation

- Clone the repository or download the repo as a [zip](https://github.com/contentful/ui-extensions-sdk/archive/master.zip)
```bash
git clone git@github.com:contentful/ui-extensions-sdk.git
```
- Navigate into the extension folder
```bash
cd examples/wistia
```
- Install dependencies
```bash
npm install
```
- Create a configuration file with your credentials for Contentful
```bash
touch .env
echo "SPACE_ID={YOUR-SPACE-ID}" >> .env
echo "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN={YOUR-MANAGEMENT-TOKEN}" >> .env

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

### Using the extension in the Contentful App

Next, we will enable the extension in the Contentful App for a “Short text” field so that you can see it in action.

In your space, choose any Content Type with a “Short text” field or create a new one. Then open the “Settings” dialog for a field and switch to the appearance tab. An extension with the name “Wistia video extension” should be visible at the end of the list. (Note that you need to reload the app after you uploaded a extension.) Select the extension from the list and save the Content Type. Finally you can open an entry for that Content Type and see the extension rendered.
