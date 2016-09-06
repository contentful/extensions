export default function createInputUpdater (inputEl, document) {
  return function updateInputValue (value) {
    const currentValue = inputEl.value

    if (currentValue !== value) {
      // Chrome has a bug where the element will receive focus after
      // calling `setSelectionRange()`. We only update the caret
      // position if the element is actually focused.
      if (document.activeElement === inputEl) {
        const newCaretPosition =
          getPreservedCaretPosition(inputEl.selectionStart, currentValue, value)
        inputEl.value = value
        inputEl.setSelectionRange(newCaretPosition, newCaretPosition)
      } else {
        inputEl.value = value
      }
    }
  }
}

function getPreservedCaretPosition (caretPosition, oldValue, newValue) {
  const equalUpTo = getCommonPrefixLength(oldValue, newValue)
  if (equalUpTo <= caretPosition) {
    // Insert or delete before the cursor
    const diffLength = newValue.length - oldValue.length
    return Math.max(caretPosition + diffLength, 0)
  } else {
    // Insert or delete after the cursor. Nothing to do
    return caretPosition
  }
}

function getCommonPrefixLength (a, b) {
  if (a === b) {
    return a.length
  }

  if (!a || !b) {
    return 0
  }

  let length = 0
  while (a.charAt(length) === b.charAt(length)) {
    length++
  }
  return length
}
