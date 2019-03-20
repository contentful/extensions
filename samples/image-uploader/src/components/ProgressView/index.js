import React from "react"
import "./progress-view.css"

export default function UploadView(props) {
  const imageUrl = props.imageUrl || `${props.base64Prefix},${props.base64Data}`

  const background = {
    backgroundImage: `url(${imageUrl})`
  }

  // Pass upload progress as CSS variable so we can adjust the size of progress components
  const uploadProgress = {
    "--uploadProgress": `${props.uploadProgress}%`
  }

  return (
    <div className="viewport">
      <main className="progress-view" style={background}>
        <aside className="bar" style={uploadProgress} />
        <aside className="bar-placeholder" style={uploadProgress} />
        <aside className="overlay" style={uploadProgress} />
      </main>
    </div>
  )
}
