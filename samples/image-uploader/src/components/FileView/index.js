import React from "react"
import {
  Heading,
  Button,
  Paragraph
} from "@contentful/forma-36-react-components"

import Dropzone from "../Dropzone"
import { trimFilename } from "../../utils"
import { MAX_ASSET_TITLE_LEN } from "../../config"

import "./fileview.css"

export default function FileView(props) {
  const file = props.file
  const prettySize = `${(file.details.size / 1000000).toFixed(2)} MB`
  const bg = {
    backgroundImage: `url(${file.url})`
  }

  return (
    <Dropzone
      className="file-view viewport"
      isDraggingOver={props.isDraggingOver}
      onDrop={props.onDropFiles}
      onDragOverStart={props.onDragOverStart}
      onDragOverEnd={props.onDragOverEnd}
    >
      <header style={bg} />
      <section className="details">
        <main>
          <Heading extraClassNames="filename">
            {trimFilename(file.fileName, MAX_ASSET_TITLE_LEN)}
          </Heading>
          <Paragraph extraClassNames="row">
            <strong>Dimensions:</strong> {file.details.image.width}x
            {file.details.image.height}
          </Paragraph>
          <Paragraph extraClassNames="row">
            <strong>Size:</strong> {prettySize}
          </Paragraph>
          <Paragraph extraClassNames="row">
            <strong>Type:</strong> {file.contentType}
          </Paragraph>
          <Paragraph extraClassNames="row">
            <strong>Status:</strong> {props.isPublished ? "Published" : "Draft"}
          </Paragraph>
        </main>
        <nav className="buttonset">
          <Button
            buttonType="muted"
            extraClassNames="button"
            onClick={props.onClickEdit}
          >
            Edit
          </Button>
          <Button
            buttonType="muted"
            extraClassNames="button"
            onClick={props.onClickRemove}
          >
            Remove
          </Button>
        </nav>
      </section>
    </Dropzone>
  )
}
