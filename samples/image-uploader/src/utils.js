import imageMimeTypes from "./image-mime-types.json"

/* Takes an HTML5 file, encodes as Base64 data Url,
   returns a two element list of Base64 Url prefix and
   raw Base64 data.

   readFileAsUrl(file: HTMLFile): [string, string]
 */
export function readFileAsUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function(e) {
      resolve(e.target.result.split(","))
    }

    reader.onerror = function(e) {
      reject(e.error)
    }

    reader.onabort = function(e) {
      reject(new Error("File aborted."))
    }

    reader.readAsDataURL(file)
  })
}

// getImageUrlFromDataTransfer(dataTransfer: DataTransfer): string?
export function getImageUrlFromDataTransfer(dataTransfer) {
  const html = dataTransfer.getData("text/html")
  if (!html) {
    return
  }

  const frag = document.createElement("main")
  frag.innerHTML = html

  return frag.querySelector("img").src
}

// getAssetIdFromDataTransfer(dataTransfer: DataTransfer): string?
export function getAssetIdFromDataTransfer(dataTransfer) {
  const plain = dataTransfer.getData("text/plain")
  const match = plain.match(/spaces\/\w+\/assets\/(\w+)\/?$/)

  if (!match) {
    return
  }

  return match[1]
}

// getMimeTypeByPath(path: string): [mimetype, isImage]
export function getMimeTypeByPath(uri) {
  // Unsplash doesn't have file extensions in their urls, so
  if (isUnsplashImageUrl(uri)) {
    return [imageMimeTypes["jpeg"], true]
  }

  const type =
    imageMimeTypes[
      uri
        .replace(/\?.*$/, "")
        .split(".")
        .slice(-1)[0]
    ]
  return [type, !!type]
}

function isUnsplashImageUrl(url) {
  return /https:\/\/images.unsplash.com\/photo-[\w-]+\/?/.test(url)
}
