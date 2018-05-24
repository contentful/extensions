## Default field values

This UI Extension uses configuration parameters to set a default value for a field.

![Screenshot of template](http://contentful.github.io/extensions/assets/uiextensions-default-field-value.png)
The UI Extension in the Contentful web app

The default values are set through instance parameters when the extension is installed into a space:

```bash
{
  "id": "default-field-value",
  "name": "Default value for a field",
  "srcdoc": "extension.html",
  "fieldTypes": ["Symbol"],
  "parameters": {
    "instance": [
      {
        "id": "defaultColor",
        "name": "Default color",
        "description": "Set which color is the default color",
        "type": "Enum",
        "options": [{"#0000FF": "blue"}, {"#FFFF00": "yellow"}, {"#FF0000": "red"}],
        "labels": {"empty": "Choose a color"},
        "required": true
      }
    ]
  }
}
```

In this example we used an `enum` field which predefines the available values to hex values of `blue`, `yellow` and `red`. When assigning the extension to a field in a content type, those values can be used to set the default value:

![Screenshot of params](http://contentful.github.io/extensions/assets/uiextensions-default-field-value-assign.png)
Assigning the UI Extension to a content type and setting the instance parameter

During rendering of the extension in the entry editor, the extension will set the field value to default.

Read more about configuration parameters in the [installation and instance parameters](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/ui-extensions/configuration-parameters) section of the Content Management API.

## Usage

To install the UI Extension:
```bash
contentful extension create
```
To update the UI Extension:
```bash
contentful extension update --force
```
