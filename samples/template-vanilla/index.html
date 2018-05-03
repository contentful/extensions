<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <!-- UI Extensions CSS -->
  <link rel="stylesheet" href="https://contentful.github.io/ui-extensions-sdk/cf-extension.css">
  <!-- UI Extensions SDK -->
  <script src="https://unpkg.com/contentful-ui-extensions-sdk@3"></script>
</head>
<body>
  <!-- Custom markup of the UI Extension -->
  <div class="cf-form-field">
    <input type="text" class="cf-form-input">
    <div class="cf-form-hint">I am a UI Extension.</div>
    <div class="cf-form-hint">Instance params: <span class="instance-param-value"></span></div>
    <div class="cf-form-hint">Installation params: <span class="installation-param-value"></span></div>
  </div>

  <!-- Custom logic of the UI Extension -->
  <script>
    'use strict';

    // When UI Extensions SDK is loaded the callback will be executed.
    window.contentfulExtension.init(initExtension);

    function initExtension (extensionsApi) {
      // "extensionsApi" is providing an interface documented here:
      // https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md

      // Automatically adjust UI Extension size in the Web App.
      extensionsApi.window.startAutoResizer();

      var inputEl = document.querySelector('.cf-form-input');

      //  The field this UI Extension is assigned to.
      var field = extensionsApi.field;

      document.querySelector('.instance-param-value').appendChild(document.createTextNode(extensionsApi.parameters.instance.exampleParameter))
      document.querySelector('.installation-param-value').appendChild(document.createTextNode(extensionsApi.parameters.installation.exampleParameter))


      // Callback for changes of the field value.
      var detachValueChangeHandler = field.onValueChanged(valueChangeHandler);
      // Handle keyboard input.
      inputEl.addEventListener('input', keyboardInputHandler);
      // Handle DOM "onbeforeunload" event.
      window.addEventListener('onbeforeunload', unloadHandler);

      // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
      function valueChangeHandler (value) {
        inputEl.value = value || '';
      }

      // Event handler for keyboard input.
      function keyboardInputHandler () {
        var value = inputEl.value;
        if (typeof value !== 'string' || value === '') {
          field.removeValue();
        } else {
          field.setValue(value);
        }
      }

      // Event handler for window unload.
      function unloadHandler () {
        window.removeEventListener('onbeforeunload', unloadHandler);
        inputEl.removeEventListener('input', keyboardInputHandler);
        detachValueChangeHandler();
      }
    }
  </script>
</body>
</html>
