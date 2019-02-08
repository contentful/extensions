import "babel-polyfill"
import { init } from "contentful-ui-extensions-sdk"
import React from "react"
import ReactDOM from "react-dom"
import { default as relativeDate } from "relative-date"
import "@contentful/forma-36-react-components/dist/styles.css"
import "@contentful/forma-36-fcss/dist/styles.css"
import {
  Button,
  TextLink,
  Paragraph,
  Subheading
} from "@contentful/forma-36-react-components"

class App extends React.Component {
  constructor(props) {
    super(props)

    // Trigger update method to setup initial state
    this.state = this.constructState()
  }

  componentDidMount = () => {
    this.detachFns = []

    // Update component state when a field value changes
    const fields = this.props.extension.entry.fields
    for (let key in fields) {
      this.detachFns.push(fields[key].onValueChanged(this.onUpdate))
    }

    // Pull content types. We'll need them to find out display fields
    this.props.extension.space.getContentTypes().then(allContentTypes => {
      const displayFieldsMap = {}
      allContentTypes.items.forEach(ct => {
        displayFieldsMap[ct.sys.id] = ct.displayField
      })

      this.setState({
        displayFieldsMap
      })
    })
  }

  componentWillUnmount = () => {
    this.detachFns.forEach(detach => detach())
  }

  constructState = () => {
    const sys = this.props.extension.entry.getSys()

    return {
      isDraft: !sys.publishedVersion,
      hasPendingChanges: sys.version > (sys.publishedVersion || 0) + 1,
      isPublished: sys.version === (sys.publishedVersion || 0) + 1
    }
  }

  onError = error => {
    this.props.extension.notifier.error(error.message)
  }

  onUpdate = () => {
    this.setState(this.constructState())
  }

  unpublishedReferences = entry => {
    const referenceFieldNames = []
    const entryReferenceIds = []

    for (let name in entry.fields) {
      let locale = this.props.extension.locales.default
      if (
        entry.fields[name][locale].sys &&
        entry.fields[name][locale].sys.type === "Link" &&
        entry.fields[name][locale].sys.linkType === "Entry"
      ) {
        referenceFieldNames.push(name)
        entryReferenceIds.push(entry.fields[name][locale].sys.id)
      }
    }

    return this.props.extension.space
      .getEntries({
        "sys.id[in]": entryReferenceIds.join(",")
      })
      .then(referenceEntries => {
        return referenceEntries.items
          .filter(entry => !entry.sys.publishedVersion)
          .map((entry, ind) => ({
            field: referenceFieldNames[ind],
            entry
          }))
      })
  }

  getLinkedAndPublishedEntries = entry => {
    return this.props.extension.space
      .getEntries({ links_to_entry: entry.sys.id })
      .then(linkedEntries =>
        linkedEntries.items.filter(entry => !!entry.sys.publishedVersion)
      )
  }

  getEntryDisplayFieldValue = entry => {
    return entry.fields[
      this.state.displayFieldsMap[entry.sys.contentType.sys.id]
    ][this.props.extension.locales.default]
  }

  onClickUnpublish = () => {
    const ext = this.props.extension
    const sys = ext.entry.getSys()

    ext.space.getEntry(sys.id).then(async entry => {
      const linkedAndPublishedEntries = await this.getLinkedAndPublishedEntries(
        entry
      )

      let title = "Unpublish entry?"
      let message = "This entry will be unpublished. Continue?"
      let confirmLabel = "Unpublish"

      if (linkedAndPublishedEntries.length > 0) {
        title = "Entry is linked in other entries"
        confirmLabel = "Unpublish anyway"
        message =
          `There are ${
            linkedAndPublishedEntries.length
          } entries that link to this entry: ` +
          linkedAndPublishedEntries
            .map(this.getEntryDisplayFieldValue)
            .join(", ")
      }

      this.props.extension.dialogs
        .openConfirm({
          title,
          message,
          confirmLabel,
          cancelLabel: "Cancel"
        })
        .then(result => {
          if (!result) return

          entry.then(() => this.onUpdate()).catch(error => this.onError(error))
        })
    })
  }

  onClickPublish = () => {
    const ext = this.props.extension
    const sys = ext.entry.getSys()

    ext.space.getEntry(sys.id).then(async entry => {
      const unpublishedReferences = await this.unpublishedReferences(entry)

      let title = "Publish entry?"
      let message =
        "This entry will be published and become available on your website or app."
      let confirmLabel = "Publish"

      if (unpublishedReferences.length > 0) {
        title = "You have unpublished links"
        message =
          "Not all links on this entry are published. See sections: " +
          unpublishedReferences.map(ref => ref.field).join(", ")
        confirmLabel = "Publish anyway"
      }

      this.props.extension.dialogs
        .openConfirm({
          title,
          message,
          confirmLabel,
          cancelLabel: "Cancel"
        })
        .then(result => {
          if (!result) return

          ext.space
            .publishEntry(entry)
            .then(() => this.onUpdate())
            .catch(error => this.onError(error))
        })
    })
  }

  renderStatusLabel = () => {
    if (this.state.isPublished) {
      return "Published"
    }

    if (this.state.isDraft) {
      return "Draft"
    }

    return "Published (pending changes)"
  }

  render = () => {
    const ago = relativeDate(
      new Date(this.props.extension.entry.getSys().updatedAt)
    )

    return (
      <div className="foo">
        <Paragraph extraClassNames="f36-margin-bottom--s">
          <strong>Status: </strong>
          {this.renderStatusLabel()}
        </Paragraph>
        <Button
          extraClassNames="publish-button"
          buttonType="positive"
          isFullWidth={true}
          onClick={this.onClickPublish}
        >
          Publish
        </Button>
        <TextLink
          extraClassNames="f36-margin-top--s f36-margin-bottom--xs"
          onClick={this.onClickUnpublish}
        >
          Unpublish
        </TextLink>
        <Paragraph>Last saved {ago}</Paragraph>
      </div>
    )
  }
}

init(extension => {
  ReactDOM.render(
    <App extension={extension} />,
    document.getElementById("root")
  )
})
