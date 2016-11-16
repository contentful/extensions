YouTube ID
--------------

![youtube-id](http://contentful.github.io/extensions/assets/youtube-id.png)

This extension extracts the video ID from a YouTube URI.

### Installation and usage

Ensure you checked [the samples requirements listed here](../README.md).

Compile the extension:

```bash
npm install
make
```

Install extension for space:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your Contentful management api token>
export SPACE=<id of space you want to install extension for>

contentful-extension create --space-id $SPACE
```

From this point on, you can use the [other commands](https://github.com/contentful/contentful-extension-cli#available-commands) the contentful-extension-cli provides.
