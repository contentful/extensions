import debounce from "debounce-fn"
import React from "react"
import ReactDOM from "react-dom"
import {
  SectionHeading,
  Paragraph,
  Icon
} from "@contentful/forma-36-react-components"
import "@contentful/forma-36-react-components/dist/styles.css"
import "@contentful/forma-36-fcss/dist/styles.css"
import { init } from "contentful-ui-extensions-sdk"
import "./index.css"

const filterDuplicates = x => [...new Set(x)]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allContentTypes: [],
      childReferences: [],
      entryMap: {},
      siblingReferences: []
    }

    this.onViewingEntryUpdated = debounce(this.onViewingEntryUpdated, {
      wait: 250
    })
  }

  componentDidMount = async () => {
    this.detachFns = []

    // Update component state when a field value changes
    const fields = this.props.extension.entry.fields
    for (let key in fields) {
      this.detachFns.push(
        fields[key].onValueChanged(this.onViewingEntryUpdated)
      )
    }

    // Listen sys changes
    this.detachFns.push(
      this.props.extension.entry.onSysChanged(this.onViewingEntryUpdated)
    )

    await this.setContentTypeList()
    await this.setSiblingReferences()
    await this.setChildReferences()
    await this.setEntryMap()
  }

  componentDidUpdate = () => {
    this.props.extension.window.updateHeight()
  }

  componentWillUnmount = () => {
    this.detachFns.forEach(detach => detach())
  }

  // Walk through all the fields of the entry and extract ids of all child entries.
  //
  // A child reference is expected to have following structure:
  // {
  //   fieldId: string,
  //   fieldLabel: string,
  //   entryIds: number[]
  // }
  setChildReferences = () => {
    const contentTypeId = this.props.extension.entry.getSys().contentType.sys.id
    const contentType = this.state.allContentTypes.find(
      ct => contentTypeId === ct.sys.id
    )

    // Store content type details of each field in a map,
    // so we can check if a field contains list of child entries while
    // looping through the field values
    const fieldMap = {}
    contentType.fields.forEach(field => {
      fieldMap[field.id] = field
    })

    return new Promise((resolve, reject) => {
      const result = []

      // Loop through all field values to create list of
      // all child references of currently viewed entry
      const fields = this.props.extension.entry.fields
      for (let fieldId in fields) {
        if (
          fieldMap[fieldId].type !== "Array" ||
          fieldMap[fieldId].items.linkType !== "Entry"
        ) {
          continue
        }

        result.push({
          fieldId,
          fieldLabel: fieldMap[fieldId].name,
          entryIds: fields[fieldId].getValue().map(entry => entry.sys.id)
        })
      }

      this.setState({ childReferences: result }, resolve)
    })
  }

  // We need a map of content types to determine display names, reference labels in the view
  setContentTypeList = () => {
    return new Promise((resolve, reject) => {
      this.props.extension.space.getContentTypes().then(allContentTypes => {
        this.setState(
          {
            allContentTypes: allContentTypes.items
          },
          resolve
        )
      })
    })
  }

  // Setup a central object map for all entries, so we make sure having one source of truth for each
  // entry and avoid requesting same entry multiple times. The below method will walk through given
  // entry ids, request missing entry objects, then update "entries" state with the finalized map of entries.
  setEntryMap = () => {
    let allEntryIds = []

    // Sibling references are grouped for every parent link.
    // So we loop the parent links first and extract all sibling reference ids.
    this.state.siblingReferences.forEach(links => {
      links.fields.forEach(link => {
        allEntryIds = allEntryIds.concat(link.entryIds)
      })
    })

    // In addition to sibling references, we'll need to collect entry ids of every child reference.
    this.state.childReferences.forEach(reference => {
      allEntryIds = allEntryIds.concat(reference.entryIds)
    })

    // Remove duplicates in the final array
    allEntryIds = filterDuplicates(allEntryIds)

    // Now we've collected all entry ids we need, so it's time to create a new entry map and update the state.
    return new Promise((resolve, reject) => {
      if (allEntryIds.length === 0) return resolve()

      return this.createNewEntryMap(allEntryIds).then(entryMap => {
        this.setState({ entryMap }, resolve)
      })
    })
  }

  // Find sibling references and update the state. A sibling reference is expected to have following structure:
  // {
  //   fieldId: string,
  //   fieldLabel: string,
  //   entryIds: number[]
  // }
  setSiblingReferences = () => {
    return new Promise((resolve, reject) => {
      this.getLinkedEntries()
        .then(linkedEntries =>
          Promise.all(
            linkedEntries.items.map(linkedEntry =>
              this.getSiblingReferencesOf(linkedEntry)
            )
          )
        )
        .then(siblingReferences => {
          this.setState({ siblingReferences }, resolve)
        })
    })
  }

  // Get list of entry ids, filter out the ones not cached yet.
  // Pull them, and return a new entry map with all cached entry objects.
  createNewEntryMap = entryIds => {
    const currentlyViewingEntryId = this.props.extension.entry.getSys().id
    const notCachedYet = entryIds.filter(id => !this.state.entryMap[id])

    return this.props.extension.space
      .getEntries({
        "sys.id[in]": notCachedYet.join(",")
      })
      .then(result => {
        const newEntryMap = {
          ...this.state.entryMap
        }

        result.items.forEach(entry => (newEntryMap[entry.sys.id] = entry))

        return newEntryMap
      })
  }

  getDisplayFieldName = contentTypeId => {
    return this.state.allContentTypes.find(ct => ct.sys.id === contentTypeId)
      .displayField
  }

  getDisplayFieldValue = entry => {
    return entry.fields[this.getDisplayFieldName(entry.sys.contentType.sys.id)][
      this.props.extension.locales.default
    ]
  }

  getFieldLabel = (entry, fieldId) => {
    const contentType = this.state.allContentTypes.find(
      ct => ct.sys.id === entry.sys.contentType.sys.id
    )
    return contentType.fields.find(field => field.id == fieldId).name
  }

  // Return list of parent entries
  getLinkedEntries = () => {
    return this.props.extension.space.getEntries({
      links_to_entry: this.props.extension.entry.getSys().id
    })
  }

  // Loop all the fields of parent entry, find the fields that contains
  // the viewing entry. Return the other references in the matching fields.
  //
  // A sibling reference is expected to have following structure:
  // {
  //   fieldId: string,
  //   fieldLabel: string,
  //   entryIds: number[]
  // }
  getSiblingReferencesOf = parentEntry => {
    const locale = this.props.extension.locales.default
    const entryId = this.props.extension.entry.getSys().id
    const title = this.getDisplayFieldValue(parentEntry)

    const relatedFields = Object.keys(parentEntry.fields).filter(fieldId => {
      return (
        Array.isArray(parentEntry.fields[fieldId][locale]) &&
        parentEntry.fields[fieldId][locale].some(e => e.sys.id === entryId)
      )
    })

    return {
      id: parentEntry.sys.id,
      title,
      fields: relatedFields.map(fieldId => {
        return {
          fieldId,
          fieldLabel: this.getFieldLabel(parentEntry, fieldId),
          entryIds: parentEntry.fields[fieldId][locale].map(e => e.sys.id)
        }
      })
    }
  }

  onError = error => {
    this.props.extension.notifier.error(error.message)
  }

  onViewingEntryUpdated = async () => {
    const latestSys = this.props.extension.entry.getSys()
    const entryId = latestSys.id
    const latestVersion = await this.props.extension.space.getEntry(entryId)

    this.setState({
      entryMap: {
        ...this.state.entryMap,
        [entryId]: {
          ...latestVersion,
          sys: latestSys
        }
      }
    })
  }

  openEntry = entryId => {
    return () => {
      this.props.extension.navigator.openEntry(entryId, {
        slideIn: true
      })
    }
  }

  render = () => {
    return (
      <div className="container">
        {this.renderChildReferences()}
        {this.renderSiblingReferences()}
      </div>
    )
  }

  renderChildReferences = () => {
    if (
      this.state.childReferences.length === 0 ||
      this.state.siblingReferences.length > 0
    )
      return

    const locale = this.props.extension.locales.default
    const sys = this.props.extension.entry.getSys()

    const isPublished = sys.version - 1 === sys.publishedVersion
    const title = this.props.extension.entry.fields[
      this.getDisplayFieldName(sys.contentType.sys.id)
    ].getValue()

    return (
      <section>
        <Paragraph element="a" className="link selected">
          <Icon
            icon="ChevronDown"
            color="secondary"
            className="left-icon"
          />
          {title}
        </Paragraph>
        <section className="child-refs">
          {this.state.childReferences.map(this.renderReferencesOfField)}
        </section>
      </section>
    )
  }

  renderSiblingReferences = () => {
    if (!this.state.siblingReferences) return

    return this.state.siblingReferences.map(parentLink => (
      <section className="sibling-refs">
        <Paragraph
          element="a"
          className="link"
          onClick={this.openEntry(parentLink.id)}
        >
          <Icon
            icon="ChevronDown"
            color="secondary"
            className="left-icon"
          />
          {parentLink.title}
        </Paragraph>
        <section className="child-refs">
          {parentLink.fields.map(this.renderReferencesOfField)}
        </section>
      </section>
    ))
  }

  renderReferencesOfField = ({ fieldLabel, entryIds }) => {
    return (
      <section>
        <SectionHeading className="section-label">
          {fieldLabel}
        </SectionHeading>
        {entryIds.map(id => this.state.entryMap[id]).map(this.renderRow)}
      </section>
    )
  }

  renderRow = reference => {
    if (!reference) return

    const entryId = this.props.extension.entry.getSys().id
    const locale = this.props.extension.locales.default
    const title = this.getDisplayFieldValue(reference)
    const isPublished =
      reference.sys.version - 1 === reference.sys.publishedVersion
    const listChildRefs =
      reference.sys.id === entryId && this.state.childReferences.length > 0

    return [
      <Paragraph
        onClick={this.openEntry(reference.sys.id)}
        className={`link ${entryId === reference.sys.id ? "selected" : ""} ${
          isPublished ? "published" : ""
        }`}
        element="a"
      >
        <Icon
          icon={listChildRefs ? "ChevronDown" : "ChevronRight"}
          color="secondary"
          className="left-icon"
        />
        {title}
      </Paragraph>,
      listChildRefs ? (
        <section className="child-refs">
          {this.state.childReferences.map(this.renderReferencesOfField)}
        </section>
      ) : null
    ]
  }
}

init(extension => {
  ReactDOM.render(
    <App extension={extension} />,
    document.getElementById("root")
  )
})
