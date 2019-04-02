# Basic approval workflow

This UI Extension adds a basic approval workflow to the sidebar of selected content types. Users can request review from their peers and the selected reviewers can provide a positive or negative review with an optional comment. The "Publish" button is only available if there is a positive review and the entry hasn't been modified since the review was submitted.

Under the hood this UI Extension uses [PubNub](https://www.pubnub.com/) for real-time sync between users and the [Storage and Playback](https://www.pubnub.com/docs/web-javascript/storage-and-history) feature for persistence. PubNub publish and subscribe key should be provided as instance parameters of the extension in the sidebar.
