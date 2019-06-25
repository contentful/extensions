## Bynder Assets

This UI Extension integrates with [Bynder's](https://www.bynder.com) digital asset management platform. It leverages Bynder's [compact view](https://developer-docs.bynder.com/UI%20components/#compact-view) component to browse media in a project on Bynder.

The IDs of selected media is then stored in Contentful. Clients can then easily fetch content from Contentful and resolve all needed details on media by using the IDs to fetch binaries or meta data from Bynder's API.

![Screenshot](bynder-dialog-in-action.gif)
The UI Extension in the Contentful web app

## How does the UI Extension work?

- it loads Bynder's compact view
- promts for a login and password to authenticate the user
- credentials are stored in `LocalStorage` of the origin of the extension
- Bynder's compact view is used to browse and select media
- the ids and previewUrls of the media is stored in a `Object` filed in Contentful

## Requirements

- the UI Extension has to be 3rd party hosted using the `src` property
- an account with Bynder with access to a brand portal (`yourIdentifier.getbynder.com`). This value has to be provided to extension using `bynderURL` parameter.
