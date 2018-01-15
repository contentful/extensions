Inbound References
--------------

This extension shows inbound references to an entry in the sidebar.

### Installation and usage

Ensure you checked [the samples requirements listed here](../README.md).

![Screenshot of extension](https://github.com/contentful/extensions/raw/master/docs/assets/diff-extension.png)

Install extension for space:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your Contentful management api token>
export SPACE=<id of space you want to install extension for>

contentful-extension create --space-id $SPACE
```

From this point on, you can use the [other commands](https://github.com/contentful/contentful-extension-cli#available-commands) the contentful-extension-cli provides.
