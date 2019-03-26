import React from "react"

export default class Dropzone extends React.Component {
  onDragOverStart = event => {
    prevent(event)
    this.props.onDragOverStart(event)
  }

  onDragOverEnd = event => {
    prevent(event)
    this.props.onDragOverEnd(event)
  }

  onDrop = event => {
    prevent(event)
    this.props.onDrop(event)
    this.props.onDragOverEnd(event)
  }

  render() {
    const eventHandlers = {
      onDrag: prevent,
      onDragStart: prevent,
      onDragEnd: prevent,
      onDragOver: prevent,
      onDragEnter: this.onDragOverStart,
      onDragLeave: this.onDragOverEnd,
      onDrop: this.onDrop
    }

    const className = `dropzone ${this.props.className} ${
      this.props.isDraggingOver ? "dragover" : ""
    }`

    return (
      <div className={className} {...eventHandlers}>
        {this.props.children}
      </div>
    )
  }
}

function prevent(e) {
  e.preventDefault()
  e.stopPropagation()
}
