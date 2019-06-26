## Cloudinary Dialog

This UI Extension integrates with [Cloudinary's](https://cloudinary.com/) dynamic asset management platform. It leverages Cloudinary's [media library widget](https://cloudinary.com/documentation/media_library_widget) component to browse media in a project on Cloudinary.

The IDs of selected media is then stored in Contentful. Clients can then easily fetch content from Contentful and resolve all needed details on media by using the IDs to fetch binaries or meta data from Cloudinary's API.

## Requirements

- the UI Extension has to be 3rd party hosted using the `src` property
- an Cloudinary account
