/* Takes an HTML5 file, encodes as Base64 data URL,
   returns a two element list of Base64 URL prefix and
   raw Base64 data.

   readFileAsURL(file: HTMLFile): [string, string]
 */
export function readFileAsURL(file) {
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

export function trimFilename(filename, len) {
  if (filename.length <= len) {
    return filename
  }

  const basename = filename.replace(/\.\w+$/)
  const extMatch = filename.match(/\.\w+$/)
  const ext = extMatch ? extMatch[0] : ""

  return `${basename.slice(0, len - ext.length + 1)}${ext}`
}
