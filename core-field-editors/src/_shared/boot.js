import {init} from 'contentful-ui-extensions-sdk'

export default function makeBooter (create) {
  return function boot () {
    init((api) => {
      document.body.appendChild(create(api))
      setTimeout(() => {
        api.window.updateHeight()
      }, 10)
    })
  }
}
