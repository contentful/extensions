import * as assert from 'assert'

/**
 * Create a collection of assertion functions for elements contained in
 * a given DOM node.
 */
export default function dom (root) {
  return {
    value,
    unique,
    notHasSelector,
    hasStatus,
    notHasStatus,
    valid,
  }

  /**
   * Asserts that there exists exactly one element matched by the
   * selector and that its `value` property is strictly equal to the
   * given value.
   *
   * @param {string} selector
   * @param {any} value
   */
  function value (selector, value) {
    const el = unique(selector)
    assert.strictEqual(el.value, value)
  }

  /**
   * Asserts that there exists exactly one ancestor element that is
   * matched by the CSS selector.
   *
   * Returns the matched element.
   *
   * @param {string} selector
   */
  function unique (selector) {
    const result = root.querySelectorAll(selector)
    assertOk(
      result.length > 0,
      `No element selected by ${selector}`
    )
    assertOk(
      result.length <= 1,
      `Multiple elements selected by ${selector}`
    )
    return result.item(0)
  }


  /**
   * Assert that no ancestor matches the selector.
   *
   * @param {string} selector
   */
  function notHasSelector (selector) {
    const results = root.querySelectorAll(selector)
    if (results.length !== 0) {
      assert.fail(
        results.item(0).outerHTML,
        undefined,
        `Found selector ${selector}`,
      )
    }
  }


  /**
   * Assert that there exists an element with the ARIA role
   * [status][aria-role-status] and has the given `data-status-code`
   * attribute.
   *
   * [aria-role-status]: https://www.w3.org/TR/wai-aria-1.1/#status
   */
  function hasStatus (code) {
    unique(`[role="status"][data-status-code="${code}"]`)
  }


  function notHasStatus (code) {
    notHasSelector(`[role="status"][data-status-code="${code}"]`)
  }


  /**
   * Asserts that the element specified by the selector is unique and
   * valid according to [ARIA][aria-invalid].
   *
   * That is the `aria-invalid` attribute is either missing, empty, or
   * has value “false”.
   *
   * [aria-invalid]: https://www.w3.org/TR/wai-aria-1.1/#aria-invalid
   */
  function valid (selector, expectValid = true) {
    const message = expectValid
      ? `Element ${selector} is invalid`
      : `Element ${selector} is valid`
    const el = unique(selector)
    const value = el.getAttribute('aria-invalid')
    const isValid = value === null || value === '' || value === 'false'
    assertOk(isValid === expectValid, message)
  }
}


/**
 * Similar to node’s `assert.ok()` but will not have `actual` and
 * `expected` properties by default.
 */
function assertOk (value, message, actual) {
  if (!value) {
    assert.fail(actual, undefined, message)
  }
}
