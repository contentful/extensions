# Contentful External API UI Extension 

## Summary
This extension demonstrates accessing an external API and storing the underlying data within contentful.

The API does not need to satisfy any requirements for response format.

## Description
Consuming the external API is performed similiar to a standalone application. This demo uses jquery to perform an ajax request for dummy data from jsonplaceholder.typicode.com.

Once the API responds, jquery is used to build a dropdown of options. The contentful UI Extension SDK provides access to persist data sourced from the service to the underlying data model.

See the [UI Extension SDK documentation](https://github.com/contentful/ui-extensions-sdk) for a full description of its capabilities.

## Next Steps
Adding additional behaviors to the extension are simple. You can add more information to the dropdown, display images, etc. by modifying or replacing the code generating the dropdown.