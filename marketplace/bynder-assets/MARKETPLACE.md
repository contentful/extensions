Integrate with Bynder's digital asset management.

This extension allows you to browse media stored in Bynder and reference it from Entries. The IDs of selected media is
then stored in Contentful. Clients can then easily fetch content from Contentful and resolve all needed details on media
by using the IDs to fetch binaries or meta data from Bynder's API.

![](bynder-dialog-in-action.gif)

To set up the extension you need an account with Bynder with access to a brand portal (`yourIdentifier.getbynder.com`).
This value has to be provided to the extension using the `bynderURL` parameter.
