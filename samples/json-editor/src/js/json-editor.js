/*
* Custom JSON editor extension
* Displays JSON object, validates on the fly and saves if its valid
*/

'use strict';

+function() {

  if (typeof window.contentfulExtension === 'undefined') {
    // Backwards compatibility with devloper preview program.
    window.contentfulExtension = window.contentfulWidget;
  }
  if (typeof window.contentfulExtension === 'undefined') {
    throw new Error('Depends on contentful-extension-api.js');
  }

  var cfApi;
  var cm;
  var elements = {};

  var editorSize = {
    width: 'auto',
    height: 310
  };

  // Keeps track of some states
  var inputValid = true;
  var undoable = false;
  var redoable = false;

  var events = {
    initialize: function(resp) {
      cfApi = resp;

      // Create elements
      elements.toolbar = createElement('div', {className: 'toolbar'});
      elements.editor = createElement('div');
      elements.title = createElement('div', {className: 'title'}, elements.toolbar);
      elements.undo = createElement('div', {className: 'undo'}, elements.toolbar);
      elements.redo = createElement('div', {className: 'redo'}, elements.toolbar);
      elements.info = createElement('div', {className: 'validation'}, elements.toolbar);

      // Initialize Code Mirror
      cm = CodeMirror(elements.editor, {
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: {name: 'javascript', json: true},
        lineWrapping: true,
        viewportMargin: Infinity,
        indentUnit: 4,
        theme: 'default'
      });

      cm.setSize(editorSize.width, editorSize.height - 50);

      // Watch for events
      window.addEventListener('cfWidgetReady', events.extensionReady);
      cm.on('change', events.textChanged);
      elements.undo.addEventListener('click', events.undo);
      elements.redo.addEventListener('click', events.redo);


      var val = cfApi.field.getValue();
      cm.doc.setValue(beautify(val));
      cm.clearHistory();
      updateHistorySize();
      // Update height
      cfApi.window.updateHeight(editorSize.height);
    },
    textChanged: function(evt) {
      validateAndSave(evt.getValue());
      updateHistorySize();
    },
    undo: function(evt) {
      evt.preventDefault();
      cm.undo();
    },
    redo: function(evt) {
      evt.preventDefault();
      cm.redo();
    }

  };

  var createElement = function(elem, opts, parent) {
    var e = document.createElement(elem);
    var prop;

    for (prop in opts) {
      e[prop] = opts[prop];
    }
    parent = parent || document.body;
    parent.appendChild(e);
    return e;
  };

  var isValidJson = function(str) {
    var parsed;
    try {
      parsed = JSON.parse(str)
    } catch (e) {
      return false;
    }
    // An object or array is valid JSON
    if (typeof parsed !== 'object') {
      return false;
    }
    return true;
  };

  // Takes an object and returns a pretty-printed JSON string
  var beautify = function(obj) {
    if (obj === null || obj === undefined) {
      return '';
    } else {
      return JSON.stringify(obj, null, '\t');
    }
  };

  // http://davidwalsh.name/javascript-debounce-function
  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  var validateAndSave = debounce(function(str) {
    if (str === '') {
      updateValidationMessage(true); // don't show invalid message
    } else if (isValidJson(str)) {
      var val = JSON.parse(str);
      updateValidationMessage(val);
      cfApi.field.setValue(val);
    } else {
      updateValidationMessage(false)
    }
  }, 150);

  var updateHistorySize = function() {
    if ((cm.historySize().undo > 0) === undoable) {
      undoable = !undoable;
      elements.undo.className = undoable ? 'undo' : 'undo active';
    }
    if ((cm.historySize().redo > 0) === redoable) {
      redoable = !redoable;
      elements.redo.className = redoable ? 'redo' : 'redo active';
    }
  };

  var updateValidationMessage = function(valid) {
    if (valid !== inputValid) {
      elements.info.innerHTML = valid ? '' : 'JSON is invalid';
      inputValid = valid;
    }
  };

  window.contentfulExtension.init(events.initialize);

}();
