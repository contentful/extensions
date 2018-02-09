Slug Generator
--------------

![slug-widget](http://contentful.github.io/extensions/assets/slug-widget.png)

This extension enables to generate a slug using the title of the entry.
It also checks whether or not any duplicates across the other entries of the
same content type exist to warn users before publishing.

**Note**: In order to prevent publication whenever another entry has the same
value for the field, it is advised to use the "Uniqueness" validation constraint.
It can be combined with this extension.

### Installation steps

Ensure you checked [the samples requirements listed here](../README.md).

Install dependencies if not done already through `npm install`.

You then need to update the [Makefile](./Makefile), uncomment and update the
following line:
```Makefile
export SPACE=<id of space you want to install the extension for>
```

Then do the following:
```bash
make create
```

### Updating the extension
If you make any changes to the code of the extension, you may push these updates
to Contentful by calling:
```bash
make update
```

### Debugging in local environment
If you wish to run the extension from your local environment for debugging
purposes, you may use the following commands:
```bash
make update-dev
make serve
```
