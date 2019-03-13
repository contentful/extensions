import React from "react"
import { Subheading, Button, Icon } from "@contentful/forma-36-react-components"

import Dropzone from "../Dropzone"
import "./upload-view.css"

export default function UploadView(props) {
  return (
    <Dropzone
      className="upload-view viewport centered"
      isDraggingOver={props.isDraggingOver}
      onDrop={props.onDrop}
      onDragOverStart={props.onDragOverStart}
      onDragOverEnd={props.onDragOverEnd}
    >
      <main>
        {!props.isDraggingOver ? (
          <Button buttonType="muted" extraClassNames="button browse-button">
            <input
              className="file-picker"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={props.onDrop}
            />
            Select files
          </Button>
        ) : null}

        <Icon
          color={props.isDraggingOver ? "secondary" : "muted"}
          icon="Asset"
          size="large"
          extraClassNames="image-icon"
        />
        <Subheading extraClassNames="image-icon-label">
          Drop an image here
        </Subheading>
      </main>
    </Dropzone>
  )
}
