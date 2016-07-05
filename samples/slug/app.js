// import { init } from '../../lib/api'
const cfExt = window.contentfulExtension || window.contentfulWidget


cfExt.init(api => {
  const slugField = api.field
  const titleField = api.entry.fields.title

  const _ = window._
  const getSlug = window.getSlug
  const debouncedUpdateStatus = _.debounce(updateStatus, 500)

  const input = document.getElementById('slug')
  const statusElements = {
    error: document.getElementById('error'),
    ok: document.getElementById('ok'),
    loading: document.getElementById('loading')
  }

  api.window.updateHeight()

  titleField.onValueChanged(handleSlugChange)

  input.addEventListener('input', () => handleSlugChange(input.value))
  input.addEventListener('change', () => handleSlugChange(input.value))

  updateStatus(slugField.getValue())

  /**
   * Handle change of slug value caused by either changing slug field
   * or changing the title of the entry
   */
  function handleSlugChange (value) {
    setSlug(getSlug(value || ''))
  }

  /**
   * Set the input value to 'slug' and update the status by checking for
   * duplicates.
   */
  function setSlug (slug) {
    input.value = slug
    slugField.setValue(slug)
    setStatus('loading')
    debouncedUpdateStatus(slug)
  }

  /**
   * Show inline status icon based on current status
   */
  function updateStatus (slug) {
    getDuplicates(slug).then(function (hasDuplicates) {
      if (hasDuplicates) {
        setStatus('error')
      } else {
        setStatus('ok')
      }
    })
  }

  /**
   * Show icon for given status
   */
  function setStatus (status) {
    _.each(statusElements, function (el, name) {
      if (name === status) {
        el.style.display = 'inline'
      } else {
        el.style.display = 'none'
      }
    })
  }


  /**
   * Check if slug is already in use.
   * Resolves to 'true' if there are entries of the given content type that have
   * the same 'slug' value.
   */
  function getDuplicates (slug) {
    if (!slug) {
      return Promise.resolve(false)
    }

    let query = {}

    query['content_type'] = api.entry.getSys().contentType.sys.id
    query['fields.' + slugField.id] = slug
    query['sys.id[ne]'] = api.entry.getSys().id
    query['sys.publishedAt[exists]'] = true

    return api.space.getEntries(query).then(result => result.total > 0)
  }
})
