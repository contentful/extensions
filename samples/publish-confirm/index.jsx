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
    // Update component state when a field value changes
    const fields = this.props.extension.entry.fields
    for (let key in fields) {
      fields[key].onValueChanged(this.onUpdate)
    }
  }

  componentWillUnmount = () => {
    const fields = this.props.extension.entry.fields
    for (let key in fields) {
      fields[key].detachValueChangeHandler(this.onUpdate)
    }
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

  hasUnpublishedReferences = entry => {
    const entryReferenceIds = []

    for (let name in entry.fields) {
      let locale = Object.keys(entry.fields[name])[0]
      if (
        entry.fields[name][locale].sys &&
        entry.fields[name][locale].sys.type === "Link" &&
        entry.fields[name][locale].sys.linkType === "Entry"
      ) {
        entryReferenceIds.push(entry.fields[name][locale].sys.id)
      }
    }

    return this.props.extension.space
      .getEntries({
        "sys.id[in]": entryReferenceIds.join(",")
      })
      .then(referenceEntries => {
        return referenceEntries.items.some(entry => !entry.sys.publishedVersion)
      })
  }

  isLinkedToPublishedEntries = entry => {
    return this.props.extension.space
      .getEntries({ links_to_entry: entry.sys.id })
      .then(linkedEntries => {
        return (
          linkedEntries.items.length > 0 &&
          linkedEntries.items.every(entry => !!entry.sys.publishedVersion)
        )
      })
  }

  onClickUnpublish = () => {
    const ext = this.props.extension
    const sys = ext.entry.getSys()

    ext.space.getEntry(sys.id).then(async entry => {
      const isLinkedToPublishedEntries = await this.isLinkedToPublishedEntries(
        entry
      )

      this.props.extension.dialogs
        .openConfirm({
          title: "Unpublish",
          message: isLinkedToPublishedEntries
            ? "There is one other entry that links to this entry. If you unpublish it, your app(s) might break."
            : "This entry will be unpublished. Continue?",
          confirmLabel: "Yes, unpublish",
          cancelLabel: "No"
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
      const hasUnpublishedReferences = await this.hasUnpublishedReferences(
        entry
      )

      this.props.extension.dialogs
        .openConfirm({
          title: "Publish",
          message: hasUnpublishedReferences
            ? "It appears that you’ve linked to entry/entries that hasn't been published yet."
            : "This entry will be published. Continue?",
          confirmLabel: "Yes, publish",
          cancelLabel: "No"
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
